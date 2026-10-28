const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    storedName: String, // random name on disk (never the user's file name)
    originalName: String,
    mimeType: String,
    size: Number,
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    guardianName: { type: String, required: true, trim: true, maxlength: 100 },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["", "female", "male", "other"], default: "" },
    phone: { type: String, required: true, index: true },
    alternatePhone: { type: String, default: "" },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    address: { type: String, required: true, trim: true, maxlength: 500 },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    district: { type: String, required: true, trim: true, maxlength: 100 },
    state: { type: String, required: true, trim: true },
    pinCode: { type: String, required: true },
    idType: { type: String, required: true, enum: ["voter-id", "driving-licence", "passport", "aadhaar", "other"] },
    unit: { type: String, required: true, trim: true, maxlength: 150 },
    role: {
      type: String,
      required: true,
      enum: ["volunteer", "social-justice", "legal-awareness", "community-service", "women-empowerment", "youth-development", "other"],
    },
    reason: { type: String, required: true, trim: true, maxlength: 1500 },
    experience: { type: String, default: "", trim: true, maxlength: 1500 },
    consent: {
      accurateInformation: Boolean,
      conductAgreement: Boolean,
      privacyConsent: Boolean,
    },
    photo: { type: fileSchema, default: null },
    idProof: { type: fileSchema, required: true },
    panNumber: { type: String, default: "", uppercase: true, trim: true },
    panCard: { type: fileSchema, default: null },

    // KYC review (done by the admin from the "KYC Pending" page)
    kycStatus: { type: String, enum: ["pending", "verified"], default: "pending", index: true },
    kycVerifiedAt: { type: Date, default: null },
    kycVerifiedBy: { type: String, default: "" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
    adminNote: { type: String, default: "", maxlength: 1000 },
    ip: String,
  },
  { timestamps: true }
);

applicationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Application", applicationSchema);
