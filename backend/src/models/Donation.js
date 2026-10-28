const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donorName: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    pan: { type: String, default: "", uppercase: true, trim: true },
    message: { type: String, default: "", maxlength: 500 },

    // Amount is decided by the SERVER when the order is created and never taken from the
    // browser again. Stored in paise (1 INR = 100 paise).
    amountPaise: { type: Number, required: true, min: 100 },
    currency: { type: String, default: "INR" },

    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, default: null, index: true },
    method: { type: String, default: "" },
    paymentVpa: { type: String, default: "" },
    status: { type: String, enum: ["created", "paid", "failed"], default: "created", index: true },
    failureReason: { type: String, default: "" },
    paidAt: { type: Date, default: null },
    verifiedBy: { type: String, enum: ["", "client-signature", "webhook"], default: "" },
    ip: String,
  },
  { timestamps: true }
);

donationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Donation", donationSchema);
