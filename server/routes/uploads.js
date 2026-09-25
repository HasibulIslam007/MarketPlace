const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const express = require("express");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();
// Vercel serverless filesystem is read-only except /tmp (and ephemeral).
// On Render / VPS the local ./uploads folder is used as before.
const uploadDirectory = process.env.VERCEL
  ? path.join("/tmp", "uploads")
  : path.join(__dirname, "..", "uploads");
const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const files = Array.isArray(req.body.files) ? req.body.files : [];

    if (files.length === 0 || files.length > MAX_FILES) {
      return res.status(400).json({ error: `Upload between 1 and ${MAX_FILES} images` });
    }

    if (process.env.VERCEL) {
      return res.status(400).json({
        error:
          "Local uploads are disabled on Vercel (ephemeral filesystem). Use an image URL or host uploads on Cloudinary/S3 instead.",
      });
    }

    await fs.mkdir(uploadDirectory, { recursive: true });
    const uploadedUrls = [];

    for (const file of files) {
      if (typeof file !== "string") {
        return res.status(400).json({ error: "Invalid image data" });
      }

      const match = file.match(/^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/);
      if (!match) {
        return res.status(400).json({ error: "Only JPG, PNG, WEBP, and GIF images are supported" });
      }

      const extension = allowedTypes.get(match[1]);
      const buffer = Buffer.from(match[2], "base64");
      if (!buffer.length || buffer.length > MAX_FILE_SIZE) {
        return res.status(400).json({ error: "Each image must be smaller than 10 MB" });
      }

      const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${extension}`;
      await fs.writeFile(path.join(uploadDirectory, filename), buffer, { flag: "wx" });
      // Behind Vercel/Render proxies req.protocol may be http — prefer the public URL when set.
      const base = (process.env.SERVER_PUBLIC_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
      uploadedUrls.push(`${base}/uploads/${filename}`);
    }

    res.status(201).json({ urls: uploadedUrls });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;