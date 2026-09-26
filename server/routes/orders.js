const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const SSLCommerzPayment = require("sslcommerz-lts");

const { getClientUrl, getServerPublicUrl } = require("../lib/clientUrl");

const store_id = process.env.SSLCZ_STORE_ID;
const store_passwd = process.env.SSLCZ_STORE_PASSWORD;
const is_live = false; // sandbox mode

function clientUrl() {
  return getClientUrl();
}

function serverPublicUrl() {
  return getServerPublicUrl();
}

// CREATE ORDER + START PAYMENT
router.post("/", requireAuth, async (req, res) => {
  try {
    const { items, shipping } = req.body;
    // items: [{ productId, quantity, price }]

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        userId: req.user.userId,
        status: "pending",
        total,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtOrder: item.price,
          })),
        },
      },
    });

    const tran_id = `order_${order.id}_${Date.now()}`;
    await prisma.order.update({ where: { id: order.id }, data: { tranId: tran_id } });

    const paymentData = {
      total_amount: total,
      currency: "BDT",
      tran_id,
      success_url: `${serverPublicUrl()}/api/orders/payment-success`,
      fail_url: `${serverPublicUrl()}/api/orders/payment-fail`,
      cancel_url: `${serverPublicUrl()}/api/orders/payment-cancel`,
      shipping_method: "Courier",
      product_name: "Store order",
      product_category: "General",
      product_profile: "general",
      cus_name: shipping.name,
      cus_email: shipping.email,
      cus_add1: shipping.address,
      cus_city: shipping.city,
      cus_postcode: shipping.postcode,
      cus_country: "Bangladesh",
      cus_phone: shipping.phone,
      ship_name: shipping.name,
      ship_add1: shipping.address,
      ship_city: shipping.city,
      ship_postcode: shipping.postcode,
      ship_country: "Bangladesh",
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(paymentData);

    res.json({ paymentUrl: apiResponse.GatewayPageURL, orderId: order.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SUCCESS — SSLCommerz redirects the browser here after payment
router.post("/payment-success", async (req, res) => {
  try {
    const { val_id, tran_id } = req.body;
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const validation = await sslcz.validate({ val_id });

    if (validation.status === "VALID" || validation.status === "VALIDATED") {
      await prisma.order.updateMany({ where: { tranId: tran_id }, data: { status: "paid" } });
      return res.redirect(`${clientUrl()}/order-confirmation?status=success`);
    }
    res.redirect(`${clientUrl()}/order-confirmation?status=failed`);
  } catch (err) {
    res.redirect(`${clientUrl()}/order-confirmation?status=failed`);
  }
});

// FAIL
router.post("/payment-fail", async (req, res) => {
  const { tran_id } = req.body;
  await prisma.order.updateMany({ where: { tranId: tran_id }, data: { status: "failed" } });
  res.redirect(`${clientUrl()}/order-confirmation?status=failed`);
});

// CANCEL
router.post("/payment-cancel", async (req, res) => {
  const { tran_id } = req.body;
  await prisma.order.updateMany({ where: { tranId: tran_id }, data: { status: "cancelled" } });
  res.redirect(`${clientUrl()}/order-confirmation?status=cancelled`);
});

// GET all orders (admin only)
router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE order status (admin only) — e.g. mark as shipped
router.patch("/:id/status", requireAuth, requireAdmin, async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isInteger(orderId) || orderId < 1) {
      return res.status(400).json({ error: "Invalid order ID" });
    }
    if (typeof status !== "string" || !status.trim()) {
      return res.status(400).json({ error: "A valid order status is required" });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: status.trim() },
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;