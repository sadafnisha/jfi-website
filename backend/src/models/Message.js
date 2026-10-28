const mongoose = require("mongoose");

// Messages sent from the website's message / contact forms.
const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    phone: { type: String, default: "" },
    subject: { type: String, default: "", trim: true, maxlength: 150 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    source: { type: String, enum: ["support-us", "contact-us", "other"], default: "other" },
    isRead: { type: Boolean, default: false, index: true },
    ip: String,
  },
  { timestamps: true }
);

messageSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);
