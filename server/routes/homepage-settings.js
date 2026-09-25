const express = require("express");
const prisma = require("../prismaClient");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();
const DEFAULT_SETTINGS = {
  id: 1,
  heroImageUrl: null,
  heroImageAlt: "Featured sneaker",
  heroBadge: "New Collection 2032",
  heroTitle: "Step Into",
  heroTitleAccent: "Your Best",
  heroSubtitle: "Premium footwear for every step of your journey. From athletic performance to everyday comfort.",
  discountTop: "UP TO",
  discountValue: "40%",
  discountBottom: "OFF",
  card1Icon: "truck",
  card1Title: "Free Shipping",
  card1Subtitle: "Orders over $75",
  card2Icon: "refresh",
  card2Title: "Easy Returns",
  card2Subtitle: "60-day guarantee",
};

function isValidImageUrl(value) {
  if (value === null || value === undefined || value === "") return true;
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
      : DEFAULT_SETTINGS.heroImageAlt;

    const heroBadge = typeof req.body.heroBadge === "string" ? req.body.heroBadge.trim() : DEFAULT_SETTINGS.heroBadge;
    const heroTitle = typeof req.body.heroTitle === "string" ? req.body.heroTitle.trim() : DEFAULT_SETTINGS.heroTitle;
    const heroTitleAccent = typeof req.body.heroTitleAccent === "string" ? req.body.heroTitleAccent.trim() : DEFAULT_SETTINGS.heroTitleAccent;
    const heroSubtitle = typeof req.body.heroSubtitle === "string" ? req.body.heroSubtitle.trim() : DEFAULT_SETTINGS.heroSubtitle;

    const discountTop = typeof req.body.discountTop === "string" ? req.body.discountTop.trim() : DEFAULT_SETTINGS.discountTop;
    const discountValue = typeof req.body.discountValue === "string" ? req.body.discountValue.trim() : DEFAULT_SETTINGS.discountValue;
    const discountBottom = typeof req.body.discountBottom === "string" ? req.body.discountBottom.trim() : DEFAULT_SETTINGS.discountBottom;

    const card1Icon = typeof req.body.card1Icon === "string" ? req.body.card1Icon.trim() : DEFAULT_SETTINGS.card1Icon;
    const card1Title = typeof req.body.card1Title === "string" ? req.body.card1Title.trim() : DEFAULT_SETTINGS.card1Title;
    const card1Subtitle = typeof req.body.card1Subtitle === "string" ? req.body.card1Subtitle.trim() : DEFAULT_SETTINGS.card1Subtitle;

    const card2Icon = typeof req.body.card2Icon === "string" ? req.body.card2Icon.trim() : DEFAULT_SETTINGS.card2Icon;
    const card2Title = typeof req.body.card2Title === "string" ? req.body.card2Title.trim() : DEFAULT_SETTINGS.card2Title;
    const card2Subtitle = typeof req.body.card2Subtitle === "string" ? req.body.card2Subtitle.trim() : DEFAULT_SETTINGS.card2Subtitle;

    if (!isValidImageUrl(heroImageUrl)) {
      return res.status(400).json({ error: "Hero image must be a valid HTTP or HTTPS URL" });
    }
    if (!heroImageAlt || heroImageAlt.length > 160) {
      return res.status(400).json({ error: "Hero image alt text is required and must be 160 characters or fewer" });
    }

    const payload = {
      heroImageUrl: heroImageUrl || null,
      heroImageAlt,
      heroBadge: heroBadge || DEFAULT_SETTINGS.heroBadge,
      heroTitle: heroTitle || DEFAULT_SETTINGS.heroTitle,
      heroTitleAccent: heroTitleAccent || DEFAULT_SETTINGS.heroTitleAccent,
      heroSubtitle: heroSubtitle || DEFAULT_SETTINGS.heroSubtitle,
      discountTop: discountTop || DEFAULT_SETTINGS.discountTop,
      discountValue: discountValue || DEFAULT_SETTINGS.discountValue,
      discountBottom: discountBottom || DEFAULT_SETTINGS.discountBottom,
      card1Icon: card1Icon || DEFAULT_SETTINGS.card1Icon,
      card1Title: card1Title || DEFAULT_SETTINGS.card1Title,
      card1Subtitle: card1Subtitle || DEFAULT_SETTINGS.card1Subtitle,
      card2Icon: card2Icon || DEFAULT_SETTINGS.card2Icon,
      card2Title: card2Title || DEFAULT_SETTINGS.card2Title,
      card2Subtitle: card2Subtitle || DEFAULT_SETTINGS.card2Subtitle,
    };

    const settings = await prisma.homePageSettings.upsert({
      where: { id: 1 },
      update: payload,
      create: { id: 1, ...payload },
    });

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;