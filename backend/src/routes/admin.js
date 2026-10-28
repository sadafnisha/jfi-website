const fs = require("fs");
const path = require("path");
const express = require("express");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const Application = require("../models/Application");
const Donation = require("../models/Donation");
const Media = require("../models/Media");
const Message = require("../models/Message");
const { issueToken, clearToken, requireAdmin } = require("../middleware/auth");
const { UPLOAD_DIR, MEDIA_DIR, MAX_MEDIA_IMAGE, mediaUpload, matchesSignature, removeFiles } = require("../middleware/upload");
const { str } = require("../utils/validate");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Try again in 15 minutes." },
});

// Hash used to burn the same CPU time when the e-mail does not exist (no user enumeration by timing).
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);
const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const isId = (id) => mongoose.isValidObjectId(id);

/* ------------------------------ authentication ------------------------------ */

router.post("/login", loginLimiter, async (req, res) => {
  const email = str(req.body?.email, 254).toLowerCase();
  const password = typeof req.body?.password === "string" ? req.body.password.slice(0, 200) : "";
  const generic = { message: "Invalid email or password." };

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      await bcrypt.compare(password, DUMMY_HASH);
      return res.status(401).json(generic);
    }
    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      return res.status(429).json({ message: "Account temporarily locked. Try again later." });
    }

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      admin.failedLogins += 1;
      if (admin.failedLogins >= MAX_FAILS) {
        admin.lockedUntil = new Date(Date.now() + LOCK_MS);
        admin.failedLogins = 0;
      }
      await admin.save();
      return res.status(401).json(generic);
    }

    admin.failedLogins = 0;
    admin.lockedUntil = null;
    admin.lastLoginAt = new Date();
    await admin.save();
    issueToken(res, admin);
    res.json({ email: admin.email });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
});

router.post("/logout", (_req, res) => {
  clearToken(res);
  res.json({ ok: true });
});

// Everything below this line requires a valid admin session.
router.use(requireAdmin);

router.get("/me", (req, res) => res.json({ email: req.admin.email }));

/* --------------------------------- overview --------------------------------- */

router.get("/stats", async (_req, res) => {
  const [applications, byStatus, kycPending, paid, unread, media] = await Promise.all([
    Application.countDocuments(),
    Application.aggregate([{ $group: { _id: "$status", n: { $sum: 1 } } }]),
    Application.countDocuments({ kycStatus: { $ne: "verified" } }),
    Donation.aggregate([{ $match: { status: "paid" } }, { $group: { _id: null, total: { $sum: "$amountPaise" }, n: { $sum: 1 } } }]),
    Message.countDocuments({ isRead: false }),
    Media.countDocuments(),
  ]);
  const counts = Object.fromEntries(byStatus.map((s) => [s._id, s.n]));
  res.json({
    applications: { total: applications, pending: counts.pending || 0, approved: counts.approved || 0, rejected: counts.rejected || 0 },
    kycPending,
    donations: { paidCount: paid[0]?.n || 0, totalRupees: (paid[0]?.total || 0) / 100 },
    unreadMessages: unread,
    mediaCount: media,
  });
});

/* ------------------------------- applications ------------------------------- */

function applicationFilter(q) {
  const filter = {};
  if (["pending", "approved", "rejected"].includes(q.status)) filter.status = q.status;
  // KYC: "pending" also matches older records that have no kycStatus yet
  if (q.kyc === "pending") filter.kycStatus = { $ne: "verified" };
  if (q.kyc === "verified") filter.kycStatus = "verified";
  const search = str(q.search, 80);
  if (search) {
    const rx = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ fullName: rx }, { email: rx }, { phone: rx }, { city: rx }, { district: rx }, { state: rx }, { panNumber: rx }];
  }
  return filter;
}

router.get("/applications", async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const filter = applicationFilter(req.query);
  const [items, total] = await Promise.all([
    Application.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Application.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

router.get("/applications/:id", async (req, res) => {
  if (!isId(req.params.id)) return res.status(404).json({ message: "Not found." });
  const item = await Application.findById(req.params.id).lean();
  if (!item) return res.status(404).json({ message: "Not found." });
  res.json(item);
});

router.patch("/applications/:id", async (req, res) => {
  if (!isId(req.params.id)) return res.status(404).json({ message: "Not found." });
  const update = {};
  if (req.body?.status !== undefined) {
    if (!["pending", "approved", "rejected"].includes(req.body.status)) return res.status(400).json({ message: "Invalid status." });
    update.status = req.body.status;
  }
  if (req.body?.adminNote !== undefined) update.adminNote = str(req.body.adminNote, 1000);
  const item = await Application.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
  if (!item) return res.status(404).json({ message: "Not found." });
  res.json(item);
});

// KYC: mark an applicant as verified (or undo it)
router.patch("/applications/:id/kyc", async (req, res) => {
  if (!isId(req.params.id)) return res.status(404).json({ message: "Not found." });
  const verified = req.body?.verified === true;
  const update = verified
    ? { kycStatus: "verified", kycVerifiedAt: new Date(), kycVerifiedBy: req.admin.email }
    : { kycStatus: "pending", kycVerifiedAt: null, kycVerifiedBy: "" };
  const item = await Application.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
  if (!item) return res.status(404).json({ message: "Not found." });
  res.json(item);
});

// Admin-only download of the uploaded photo / ID proof / PAN card
router.get("/applications/:id/files/:kind", async (req, res) => {
  const { id, kind } = req.params;
  if (!isId(id) || !["photo", "idProof", "panCard"].includes(kind)) return res.status(404).json({ message: "Not found." });
  const item = await Application.findById(id).select(kind).lean();
  const file = item && item[kind];
  if (!file || !file.storedName) return res.status(404).json({ message: "File not found." });

  const full = path.join(UPLOAD_DIR, path.basename(file.storedName)); // basename blocks path traversal
  if (!fs.existsSync(full)) return res.status(404).json({ message: "File missing on server." });

  res.setHeader("Content-Type", file.mimeType);
  res.setHeader("Content-Disposition", `inline; filename="${kind}-${id}${path.extname(full)}"`);
  res.setHeader("Cache-Control", "private, no-store");
  // The sandbox CSP stops scripts in uploaded files, but Chrome's built-in PDF viewer cannot run under it.
  if (file.mimeType !== "application/pdf") {
    res.setHeader("Content-Security-Policy", "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox");
  }
  res.setHeader("X-Content-Type-Options", "nosniff");
  fs.createReadStream(full).pipe(res);
});

/* --------------------------------- donations -------------------------------- */

function donationFilter(q) {
  const filter = {};
  // By default only confirmed payments are shown; ?status=all shows every attempt.
  const status = q.status || "paid";
  if (["created", "paid", "failed"].includes(status)) filter.status = status;
  const search = str(q.search, 80);
  if (search) {
    const rx = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ donorName: rx }, { email: rx }, { phone: rx }, { razorpayPaymentId: rx }, { razorpayOrderId: rx }];
  }
  return filter;
}

router.get("/donations", async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const filter = donationFilter(req.query);
  const [items, total] = await Promise.all([
    Donation.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Donation.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

/* ------------------------------ photos / videos ------------------------------ */

router.get("/media", async (_req, res) => {
  const items = await Media.find().sort({ createdAt: -1 }).lean();
  res.json(items.map((m) => ({ ...m, url: `/api/media/file/${m.storedName}` })));
});

router.post("/media", (req, res) => {
  mediaUpload(req, res, async (uploadError) => {
    const files = req.files || [];
    const fail = (status, message) => {
      removeFiles(files);
      return res.status(status).json({ message });
    };
    try {
      if (uploadError) {
        return fail(400, uploadError.code === "LIMIT_FILE_SIZE" ? "A file is too large (images up to 8 MB, videos up to 60 MB)." : uploadError.message);
      }
      if (!files.length) return fail(400, "Choose at least one photo or video.");
      for (const f of files) {
        if (!matchesSignature(f.path, f.mimetype)) return fail(400, `"${str(f.originalname, 60)}" is not a valid ${f.mimetype.split("/")[0]} file.`);
        if (f.mimetype.startsWith("image/") && f.size > MAX_MEDIA_IMAGE) return fail(400, `"${str(f.originalname, 60)}": images must be 8 MB or smaller.`);
      }
      const caption = str(req.body?.caption, 200);
      const created = await Media.insertMany(
        files.map((f) => ({
          type: f.mimetype.startsWith("video/") ? "video" : "image",
          storedName: f.filename,
          originalName: str(f.originalname, 150),
          mimeType: f.mimetype,
          size: f.size,
          caption,
        }))
      );
      res.status(201).json({ created: created.length });
    } catch (err) {
      console.error("media upload error:", err);
      fail(500, "Upload failed. Please try again.");
    }
  });
});

router.patch("/media/:id", async (req, res) => {
  if (!isId(req.params.id)) return res.status(404).json({ message: "Not found." });
  const item = await Media.findByIdAndUpdate(req.params.id, { caption: str(req.body?.caption, 200) }, { new: true }).lean();
  if (!item) return res.status(404).json({ message: "Not found." });
  res.json(item);
});

router.delete("/media/:id", async (req, res) => {
  if (!isId(req.params.id)) return res.status(404).json({ message: "Not found." });
  const item = await Media.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found." });
  fs.unlink(path.join(MEDIA_DIR, path.basename(item.storedName)), () => {});
  res.json({ ok: true });
});

/* --------------------------------- messages --------------------------------- */

router.get("/messages", async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const filter = {};
  if (req.query.status === "unread") filter.isRead = false;
  if (["support-us", "contact-us"].includes(req.query.source)) filter.source = req.query.source;
  const search = str(req.query.search, 80);
  if (search) {
    const rx = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ name: rx }, { email: rx }, { phone: rx }, { subject: rx }, { message: rx }];
  }
  const [items, total] = await Promise.all([
    Message.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Message.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

router.patch("/messages/:id", async (req, res) => {
  if (!isId(req.params.id)) return res.status(404).json({ message: "Not found." });
  const item = await Message.findByIdAndUpdate(req.params.id, { isRead: req.body?.isRead !== false }, { new: true }).lean();
  if (!item) return res.status(404).json({ message: "Not found." });
  res.json(item);
});

router.delete("/messages/:id", async (req, res) => {
  if (!isId(req.params.id)) return res.status(404).json({ message: "Not found." });
  const item = await Message.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found." });
  res.json({ ok: true });
});

/* ------------------------------- CSV exports -------------------------------- */

function csvCell(v) {
  let s = v === null || v === undefined ? "" : v instanceof Date ? v.toISOString() : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // neutralise spreadsheet formula injection
  return `"${s.replace(/"/g, '""')}"`;
}
function sendCsv(res, name, header, rows) {
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${name}-${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send("\uFEFF" + [header.join(","), ...rows.map((r) => r.map(csvCell).join(","))].join("\n"));
}

router.get("/applications.csv", async (req, res) => {
  const rows = await Application.find(applicationFilter(req.query)).sort({ createdAt: -1 }).limit(10000).lean();
  sendCsv(
    res,
    "membership-applications",
    ["Submitted", "Status", "Name", "Guardian", "DOB", "Gender", "Phone", "Alt phone", "Email", "Address", "City", "District", "State", "PIN", "ID type", "PAN", "KYC", "Unit", "Role", "Reason", "Experience"],
    rows.map((a) => [a.createdAt, a.status, a.fullName, a.guardianName, a.dob && a.dob.toISOString().slice(0, 10), a.gender, a.phone, a.alternatePhone, a.email, a.address, a.city, a.district, a.state, a.pinCode, a.idType, a.panNumber, a.kycStatus === "verified" ? "Verified" : "Pending", a.unit, a.role, a.reason, a.experience])
  );
});

router.get("/donations.csv", async (req, res) => {
  const rows = await Donation.find(donationFilter(req.query)).sort({ createdAt: -1 }).limit(10000).lean();
  sendCsv(
    res,
    "donations",
    ["Date", "Status", "Name", "Email", "Phone", "PAN", "Amount (INR)", "Method", "Donor UPI", "Payment ID", "Order ID", "Message"],
    rows.map((d) => [d.paidAt || d.createdAt, d.status, d.donorName, d.email, d.phone, d.pan, d.amountPaise / 100, d.method, d.paymentVpa, d.razorpayPaymentId, d.razorpayOrderId, d.message])
  );
});

module.exports = router;
