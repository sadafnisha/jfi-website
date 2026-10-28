const express = require("express");
const rateLimit = require("express-rate-limit");
const Application = require("../models/Application");
const Message = require("../models/Message");
const { upload, matchesSignature, removeFiles } = require("../middleware/upload");
const { STATES, str, PHONE, EMAIL } = require("../utils/validate");

const router = express.Router();

const joinLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many submissions from this network. Please try again later." },
});

const IDS = ["voter-id", "driving-licence", "passport", "aadhaar", "other"];
const ROLES = ["volunteer", "social-justice", "legal-awareness", "community-service", "women-empowerment", "youth-development", "other"];
const GENDERS = ["", "female", "male", "other"];

function fileMeta(f) {
  return f ? { storedName: f.filename, originalName: str(f.originalname, 150), mimeType: f.mimetype, size: f.size } : null;
}

// POST /api/join-us  (Membership Application Form)
router.post("/join-us", joinLimiter, (req, res) => {
  upload(req, res, async (uploadError) => {
    const files = req.files || {};
    const fail = (status, message) => {
      removeFiles(files);
      return res.status(status).json({ message });
    };

    try {
      if (uploadError) {
        const msg = uploadError.code === "LIMIT_FILE_SIZE" ? "Each file must be 5 MB or smaller." : uploadError.message;
        return fail(400, msg || "File upload failed.");
      }

      const b = req.body || {};
      const data = {
        fullName: str(b.fullName, 100),
        guardianName: str(b.guardianName, 100),
        dob: str(b.dob, 10),
        gender: str(b.gender, 10),
        phone: str(b.phone, 10),
        alternatePhone: str(b.alternatePhone, 10),
        email: str(b.email, 254).toLowerCase(),
        address: str(b.address, 500),
        city: str(b.city, 100),
        district: str(b.district, 100),
        state: str(b.state, 60),
        pinCode: str(b.pinCode, 6),
        idType: str(b.idType, 30),
        unit: str(b.unit, 150),
        role: str(b.role, 40),
        reason: str(b.reason, 1500),
        experience: str(b.experience, 1500),
        panNumber: str(b.panNumber, 10).toUpperCase(),
      };

      if (data.fullName.length < 2) return fail(400, "Enter your full name.");
      if (!data.guardianName) return fail(400, "Enter your parent / guardian name.");
      const dob = new Date(data.dob);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(data.dob) || Number.isNaN(dob.getTime()) || dob > new Date())
        return fail(400, "Enter a valid date of birth.");
      if (!GENDERS.includes(data.gender)) return fail(400, "Invalid gender value.");
      if (!PHONE.test(data.phone)) return fail(400, "Enter a valid 10-digit Indian mobile number.");
      if (data.alternatePhone && !PHONE.test(data.alternatePhone)) return fail(400, "Enter a valid alternate mobile number or leave it blank.");
      if (!EMAIL.test(data.email)) return fail(400, "Enter a valid email address.");
      if (!data.address || !data.city || !data.district) return fail(400, "Complete address details are required.");
      if (!STATES.includes(data.state)) return fail(400, "Select a valid state / UT.");
      if (!/^\d{6}$/.test(data.pinCode)) return fail(400, "PIN code must contain exactly 6 digits.");
      if (!IDS.includes(data.idType)) return fail(400, "Select a valid ID proof type.");
      if (data.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(data.panNumber)) return fail(400, "Enter a valid PAN number (for example ABCDE1234F) or leave it blank.");
      if (!data.unit) return fail(400, "Preferred unit is required.");
      if (!ROLES.includes(data.role)) return fail(400, "Select a valid area of contribution.");
      if (data.reason.length < 10) return fail(400, "Please tell us why you want to join (at least 10 characters).");
      if (b.accurateInformation !== "yes" || b.conductAgreement !== "yes" || b.privacyConsent !== "yes")
        return fail(400, "All declarations must be accepted.");

      const idProof = files.idProof && files.idProof[0];
      const photo = files.photo && files.photo[0];
      const panCard = files.panCard && files.panCard[0];
      if (!idProof) return fail(400, "ID proof upload is required.");
      for (const f of [idProof, photo, panCard].filter(Boolean)) {
        if (!matchesSignature(f.path, f.mimetype)) return fail(400, "One of the uploaded files is not a valid file of its type.");
      }

      const duplicate = await Application.findOne({
        status: "pending",
        $or: [{ phone: data.phone }, { email: data.email }],
      }).select("_id");
      if (duplicate) return fail(409, "An application with this mobile number or email is already under review.");

      await Application.create({
        ...data,
        dob,
        consent: { accurateInformation: true, conductAgreement: true, privacyConsent: true },
        photo: fileMeta(photo),
        idProof: fileMeta(idProof),
        panCard: fileMeta(panCard),
        ip: req.ip,
      });

      console.log(`[join-us] new application saved: ${data.fullName} (${data.phone})`);
      res.status(201).json({ message: "Your application has been submitted successfully. Our team will review it and contact you." });
    } catch (err) {
      console.error("join-us error:", err);
      fail(500, "The application could not be submitted. Please try again later.");
    }
  });
});

/* --------------------------------- messages --------------------------------- */

const messageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many messages from this network. Please try again later." },
});

// POST /api/messages  (Contact Us / Support Us message forms)
router.post("/messages", messageLimiter, async (req, res) => {
  try {
    const b = req.body || {};
    const name = str(b.name, 100);
    const email = str(b.email, 254).toLowerCase();
    const subject = str(b.subject, 150);
    const message = str(b.message, 2000);
    const digits = str(b.phone, 20).replace(/\D/g, "");
    const phone = digits ? digits.slice(-10) : "";
    const source = ["support-us", "contact-us"].includes(b.source) ? b.source : "other";

    if (name.length < 2) return res.status(400).json({ message: "Please enter your full name." });
    if (!EMAIL.test(email)) return res.status(400).json({ message: "Please enter a valid email address." });
    if (phone && !PHONE.test(phone)) return res.status(400).json({ message: "Please enter a valid 10-digit mobile number or leave it blank." });
    if (message.length < 10) return res.status(400).json({ message: "Please write at least 10 characters." });

    await Message.create({ name, email, phone, subject, message, source, ip: req.ip });
    console.log(`[messages] new message from ${name} via ${source}`);
    res.status(201).json({ message: "Thank you. Your message has been sent to the JFI office." });
  } catch (err) {
    console.error("messages error:", err);
    res.status(500).json({ message: "Your message could not be sent. Please try again later." });
  }
});

module.exports = router;
