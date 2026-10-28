const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

// KYC documents are stored on the local disk, OUTSIDE any public folder.
// They can only be downloaded through the admin-only route in routes/admin.js.
const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");
// Gallery photos / videos (shown publicly on the website) live in their own sub-folder.
const MEDIA_DIR = path.join(UPLOAD_DIR, "media");
fs.mkdirSync(MEDIA_DIR, { recursive: true });

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB for KYC documents
const MAX_MEDIA_IMAGE = 8 * 1024 * 1024; // 8 MB
const MAX_MEDIA_VIDEO = 60 * 1024 * 1024; // 60 MB

const EXT_BY_MIME = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
};

const randomName = (mime) => crypto.randomBytes(24).toString("hex") + (EXT_BY_MIME[mime] || ".bin");

/* ----------------------------- KYC / join form ----------------------------- */

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => cb(null, randomName(file.mimetype)), // user-supplied names are never used on disk
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE, files: 3, fields: 40 },
  fileFilter: (_req, file, cb) => {
    const photo = ["image/jpeg", "image/png", "image/webp"];
    const doc = ["application/pdf", "image/jpeg", "image/png"];
    const rules = { photo, idProof: doc, panCard: doc };
    const allowed = rules[file.fieldname];
    if (!allowed || !allowed.includes(file.mimetype)) {
      const msg = {
        photo: "Photo must be a JPG, PNG or WebP image.",
        idProof: "ID proof must be a PDF, JPG or PNG.",
        panCard: "PAN card must be a PDF, JPG or PNG.",
      }[file.fieldname];
      return cb(new Error(msg || "Unexpected file field."));
    }
    cb(null, true);
  },
}).fields([
  { name: "photo", maxCount: 1 },
  { name: "idProof", maxCount: 1 },
  { name: "panCard", maxCount: 1 },
]);

/* ------------------------------ admin gallery ------------------------------ */

const mediaUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, MEDIA_DIR),
    filename: (_req, file, cb) => cb(null, randomName(file.mimetype)),
  }),
  limits: { fileSize: MAX_MEDIA_VIDEO, files: 10, fields: 10 },
  fileFilter: (_req, file, cb) => {
    if (!EXT_BY_MIME[file.mimetype] || file.mimetype === "application/pdf") {
      return cb(new Error("Only JPG, PNG, WebP images and MP4 / WebM videos are allowed."));
    }
    cb(null, true);
  },
}).array("files", 10);

/** Checks the real file signature (magic bytes), not just the mime type the browser claimed. */
function matchesSignature(filePath, mime) {
  const fd = fs.openSync(filePath, "r");
  const buf = Buffer.alloc(12);
  fs.readSync(fd, buf, 0, 12, 0);
  fs.closeSync(fd);
  if (mime === "image/jpeg") return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  if (mime === "image/png") return buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (mime === "image/webp") return buf.slice(0, 4).toString() === "RIFF" && buf.slice(8, 12).toString() === "WEBP";
  if (mime === "application/pdf") return buf.slice(0, 5).toString() === "%PDF-";
  if (mime === "video/mp4") return buf.slice(4, 8).toString() === "ftyp";
  if (mime === "video/webm") return buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3;
  return false;
}

function removeFiles(files) {
  const list = Array.isArray(files) ? files : Object.values(files || {}).flat();
  list.forEach((f) => fs.unlink(f.path, () => {}));
}

module.exports = {
  upload,
  mediaUpload,
  matchesSignature,
  removeFiles,
  UPLOAD_DIR,
  MEDIA_DIR,
  MAX_MEDIA_IMAGE,
};
