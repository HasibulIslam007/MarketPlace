const { requireAuth, requireAdmin } = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

function createSlug(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE category
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const slug = createSlug(name);

    if (!name || !slug) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const category = await prisma.category.create({ data: { name, slug } });
    res.status(201).json(category);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "That category already exists" });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;