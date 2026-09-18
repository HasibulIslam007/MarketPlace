const { requireAuth, requireAdmin } = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

const productInclude = {
  category: true,
  images: { orderBy: { sortOrder: "asc" } },
};

// GET all products
router.get("/", async (req, res) => {
  try {
    const categorySlug = typeof req.query.category === "string" ? req.query.category : undefined;
    const products = await prisma.product.findMany({
      where: categorySlug ? { category: { slug: categorySlug } } : undefined,
      include: productInclude,
      orderBy: { createdAt: "desc" },
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET one product
router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: productInclude,
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE product
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl, imageUrls, categoryId } = req.body;
    const urls = Array.isArray(imageUrls)
      ? imageUrls.filter((url) => typeof url === "string" && url.trim()).slice(0, 5)
      : [];
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        imageUrl: imageUrl || null,
        category: categoryId ? { connect: { id: Number(categoryId) } } : undefined,
        images: urls.length
          ? { create: urls.map((url, sortOrder) => ({ url, sortOrder })) }
          : undefined,
      },
      include: productInclude,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE product
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { imageUrls, ...productData } = req.body;
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: {
        ...productData,
        ...(Array.isArray(imageUrls)
          ? {
              images: {
                deleteMany: {},
                create: imageUrls.slice(0, 5).map((url, sortOrder) => ({ url, sortOrder })),
              },
            }
          : {}),
      },
      include: productInclude,
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE product
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;