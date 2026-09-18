const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const express = require("express");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();
const uploadDirectory = path.join(__dirname, "..", "uploads");
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
      uploadedUrls.push(`${req.protocol}://${req.get("host")}/uploads/${filename}`);
    }

    res.status(201).json({ urls: uploadedUrls });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;