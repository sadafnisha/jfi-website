const fs = require("fs");
const path = require("path");
const express = require("express");
const Media = require("../models/Media");
const { MEDIA_DIR } = require("../middleware/upload");

const router = express.Router();

// GET /api/media  -> list used by the home page gallery (public)
router.get("/", async (_req, res) => {
  try {
    const items = await Media.find().sort({ createdAt: -1 }).limit(24).lean();
    res.set("Cache-Control", "public, max-age=60");
    res.json(
      items.map((m) => ({
        id: String(m._id),
        type: m.type,
        caption: m.caption,
        url: `/api/media/file/${m.storedName}`,
      }))
    );
  } catch (err) {
    console.error("media list error:", err);
    res.status(500).json({ message: "Could not load gallery." });
  }
});

// GET /api/media/file/:name  -> the actual photo / video (public, supports video seeking)
router.get("/file/:name", (req, res) => {
  const name = req.params.name;
  if (!/^[a-f0-9]{48}\.(jpg|png|webp|mp4|webm)$/.test(name)) return res.status(404).end();
  const full = path.join(MEDIA_DIR, name);
  if (!fs.existsSync(full)) return res.status(404).end();
  res.set("Cache-Control", "public, max-age=86400");
  res.set("X-Content-Type-Options", "nosniff");
  res.sendFile(full); // handles Content-Type and HTTP Range requests
});

module.exports = router;
