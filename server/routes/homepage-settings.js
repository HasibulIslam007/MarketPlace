const express = require("express");
const prisma = require("../prismaClient");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();
const DEFAULT_SETTINGS = {
  id: 1,
  heroImageUrl: null,
  heroImageAlt: "Featured sneaker",
};

function isValidImageUrl(value) {
  if (value === null || value === "") return true;
  if (typeof value !== "string" || value.length > 2000) return false;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// GET the public homepage settings.
router.get("/", async (req, res) => {
  try {
    const settings = await prisma.homePageSettings.findUnique({ where: { id: 1 } });
    res.json(settings || DEFAULT_SETTINGS);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE the homepage settings (admin only).
router.put("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const heroImageUrl = typeof req.body.heroImageUrl === "string"
      ? req.body.heroImageUrl.trim()
      : req.body.heroImageUrl;
    const heroImageAlt = typeof req.body.heroImageAlt === "string"
      ? req.body.heroImageAlt.trim()
      : "Featured sneaker";

    if (!isValidImageUrl(heroImageUrl)) {
      return res.status(400).json({ error: "Hero image must be a valid HTTP or HTTPS URL" });
    }
    if (!heroImageAlt || heroImageAlt.length > 160) {
      return res.status(400).json({ error: "Hero image alt text is required and must be 160 characters or fewer" });
    }

    const settings = await prisma.homePageSettings.upsert({
      where: { id: 1 },
      update: { heroImageUrl: heroImageUrl || null, heroImageAlt },
      create: { id: 1, heroImageUrl: heroImageUrl || null, heroImageAlt },
    });

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;