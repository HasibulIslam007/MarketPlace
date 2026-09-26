const express = require("express");
const SSLCommerzPayment = require("sslcommerz-lts");
const { requireAuth } = require("../middleware/auth");
const prisma = require("../prismaClient");

const router = express.Router();

const { getClientUrl, getServerPublicUrl } = require("../lib/clientUrl");

const CLIENT_URL = getClientUrl();
const SERVER_PUBLIC_URL = getServerPublicUrl();
const STORE_ID = process.env.SSLCOMMERZ_STORE_ID;
const STORE_PASSWORD = process.env.SSLCOMMERZ_STORE_PASSWORD;
const IS_LIVE = process.env.SSLCOMMERZ_IS_LIVE === "true";

function gateway() {
  if (!STORE_ID || !STORE_PASSWORD) {
    const error = new Error("SSLCOMMERZ credentials are not configured");
    error.statusCode = 503;
    throw error;
  }

  return new SSLCommerzPayment(STORE_ID, STORE_PASSWORD, IS_LIVE);
}

function redirectTo(path, params = {}) {
  const url = new URL(`${CLIENT_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  }
  return url.toString();
}

function validItems(items) {
  return Array.isArray(items) && items.length > 0 && items.length <= 50 && items.every((item) => (
    Number.isInteger(Number(item.productId)) &&
    Number.isInteger(Number(item.quantity)) &&
    Number(item.productId) > 0 &&
    Number(item.quantity) > 0 &&
    Number(item.quantity) <= 100
  ));
}

function amountInCents(value) {
  return Math.round(Number(value) * 100);
}

async function markOrderPaid(paymentData) {
  const tranId = paymentData.tran_id;
  const validationId = paymentData.val_id;
  const paymentStatus = String(paymentData.status || "").toUpperCase();
  const gatewayAmount = paymentData.amount ?? paymentData.currency_amount;

  if (!tranId || !validationId || !["VALID", "VALIDATED"].includes(paymentStatus)) {
    throw new Error("Payment validation failed");
  }

  const order = await prisma.order.findUnique({
    where: { tranId },
    include: { items: true },
  });

  if (!order) throw new Error("Order not found for this transaction");
  if (order.status === "paid") return order;

  if (paymentData.currency && paymentData.currency !== order.currency) {
    throw new Error("Payment currency does not match the order");
  }

  if (gatewayAmount !== undefined && amountInCents(gatewayAmount) !== amountInCents(order.total)) {
    throw new Error("Payment amount does not match the order");
  }

  return prisma.$transaction(async (transaction) => {
    const claimed = await transaction.order.updateMany({
      where: {
        id: order.id,
        status: { in: ["pending", "payment_initiated"] },
      },
      data: { status: "payment_processing" },
    });

    const currentOrder = await transaction.order.findUnique({
      where: { id: order.id },
      include: { items: true },
    });

    if (!currentOrder) throw new Error("Order not found");
    if (currentOrder.status === "paid") return currentOrder;
    if (claimed.count !== 1) throw new Error("Payment is already being processed");

    for (const item of currentOrder.items) {
      const updated = await transaction.product.updateMany({
        where: { id: item.productId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });

      if (updated.count !== 1) {
        throw new Error("One or more products are out of stock");
      }
    }

    return transaction.order.update({
      where: { id: currentOrder.id },
      data: {
        status: "paid",
        paymentGateway: "sslcommerz",
        validationId,
        bankTranId: paymentData.bank_tran_id || null,
        paidAt: new Date(),
      },
      include: { items: true },
    });
  });
}

async function validateAndCompletePayment(paymentData) {
  const sslcz = gateway();
  const validation = await sslcz.validate({ val_id: paymentData.val_id });

  if (validation.tran_id && paymentData.tran_id && validation.tran_id !== paymentData.tran_id) {
    throw new Error("Validated transaction does not match the order transaction");
  }

  return markOrderPaid({ ...paymentData, ...validation });
}

function callbackData(req) {
  return { ...req.query, ...req.body };
}

router.post("/sslcommerz/initiate", requireAuth, async (req, res) => {
  try {
    const { items, customerPhone, shippingAddress, shippingCity, shippingPostcode } = req.body;

    if (!validItems(items) || !customerPhone || !shippingAddress || !shippingCity || !shippingPostcode) {
      return res.status(400).json({ error: "Valid cart and shipping information are required" });
    }

    gateway();

    const productIds = [...new Set(items.map((item) => Number(item.productId)))];
    const requestedQuantities = new Map();
    for (const item of items) {
      const productId = Number(item.productId);
      const quantity = Number(item.quantity);
      requestedQuantities.set(productId, (requestedQuantities.get(productId) || 0) + quantity);
    }

    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const productMap = new Map(products.map((product) => [product.id, product]));

    let totalCents = 0;
    const orderItems = [];

    for (const [productId, quantity] of requestedQuantities) {
      const product = productMap.get(productId);

      if (!product) return res.status(400).json({ error: "A selected product no longer exists" });
      if (product.stock < quantity) {
        return res.status(400).json({ error: `${product.name} does not have enough stock` });
      }

      totalCents += amountInCents(product.price) * quantity;
      orderItems.push({
        productId: product.id,
        quantity,
        priceAtOrder: product.price,
      });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(401).json({ error: "User not found" });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: (totalCents / 100).toFixed(2),
        currency: "BDT",
        status: "payment_initiated",
        paymentGateway: "sslcommerz",
        customerName: user.name,
        customerPhone: String(customerPhone).trim(),
        shippingAddress: String(shippingAddress).trim(),
        shippingCity: String(shippingCity).trim(),
        shippingPostcode: String(shippingPostcode).trim(),
        items: { create: orderItems },
      },
      include: { items: true },
    });

    const tranId = `ORDER_${order.id}_${Date.now()}`;
    await prisma.order.update({ where: { id: order.id }, data: { tranId } });

    const sslcz = gateway();
    const response = await sslcz.init({
      total_amount: Number((totalCents / 100).toFixed(2)),
      currency: "BDT",
      tran_id: tranId,
      success_url: `${SERVER_PUBLIC_URL}/api/payments/sslcommerz/success`,
      fail_url: `${SERVER_PUBLIC_URL}/api/payments/sslcommerz/fail`,
      cancel_url: `${SERVER_PUBLIC_URL}/api/payments/sslcommerz/cancel`,
      ipn_url: `${SERVER_PUBLIC_URL}/api/payments/sslcommerz/ipn`,
      productcategory: "General",
      product_category: "General",
      product_profile: "general",
      product_name: `Online Store Order #${order.id}`,
      shipping_method: "Courier",
      num_of_item: orderItems.reduce((sum, item) => sum + item.quantity, 0),
      cus_name: user.name,
      cus_email: user.email,
      cus_add1: String(shippingAddress).trim(),
      cus_add2: "",
      cus_city: String(shippingCity).trim(),
      cus_state: String(shippingCity).trim(),
      cus_postcode: String(shippingPostcode).trim(),
      cus_country: "Bangladesh",
      cus_phone: String(customerPhone).trim(),
      ship_name: user.name,
      ship_add1: String(shippingAddress).trim(),
      ship_add2: "",
      ship_city: String(shippingCity).trim(),
      ship_state: String(shippingCity).trim(),
      ship_postcode: String(shippingPostcode).trim(),
      ship_country: "Bangladesh",
      value_a: String(order.id),
    });

    if (!response || !response.GatewayPageURL) {
      await prisma.order.update({ where: { id: order.id }, data: { status: "failed" } });
      return res.status(502).json({ error: "SSLCOMMERZ did not return a payment URL" });
    }

    return res.json({ paymentUrl: response.GatewayPageURL, orderId: order.id });
  } catch (error) {
    console.error("SSLCOMMERZ initiation failed:", error);
    return res.status(error.statusCode || 500).json({ error: error.message || "Unable to start payment" });
  }
});

router.get("/orders/:id", requireAuth, async (req, res) => {
  const orderId = Number(req.params.id);
  if (!Number.isInteger(orderId) || orderId < 1) {
    return res.status(400).json({ error: "Invalid order ID" });
  }

  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: req.user.userId },
      select: { id: true, status: true, total: true, currency: true },
    });

    if (!order) return res.status(404).json({ error: "Order not found" });
    return res.json(order);
  } catch (error) {
    return res.status(500).json({ error: "Unable to retrieve order status" });
  }
});

router.all("/sslcommerz/success", async (req, res) => {
  try {
    const order = await validateAndCompletePayment(callbackData(req));
    return res.redirect(redirectTo("/payment/success", { orderId: order.id }));
  } catch (error) {
    console.error("SSLCOMMERZ success validation failed:", error);
    return res.redirect(redirectTo("/payment/failure"));
  }
});

router.all("/sslcommerz/ipn", async (req, res) => {
  try {
    await validateAndCompletePayment(callbackData(req));
    return res.status(200).send("IPN processed");
  } catch (error) {
    console.error("SSLCOMMERZ IPN validation failed:", error);
    return res.status(400).send("IPN validation failed");
  }
});

async function markPaymentStatus(req, status) {
  const tranId = callbackData(req).tran_id;
  if (tranId) {
    await prisma.order.updateMany({
      where: { tranId, status: { not: "paid" } },
      data: { status },
    });
  }
}

router.all("/sslcommerz/fail", async (req, res) => {
  try {
    await markPaymentStatus(req, "failed");
  } catch (error) {
    console.error("Unable to mark failed payment:", error);
  }
  return res.redirect(redirectTo("/payment/failure"));
});

router.all("/sslcommerz/cancel", async (req, res) => {
  try {
    await markPaymentStatus(req, "cancelled");
  } catch (error) {
    console.error("Unable to mark cancelled payment:", error);
  }
  return res.redirect(redirectTo("/payment/cancelled"));
});

module.exports = router;