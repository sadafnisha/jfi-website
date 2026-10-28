require("dotenv").config();

const isProd = process.env.NODE_ENV === "production";

const config = {
  isProd,
  port: Number(process.env.PORT) || 5000,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/jfi",
  jwtSecret: process.env.JWT_SECRET || "",
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || "",
    keySecret: process.env.RAZORPAY_KEY_SECRET || "",
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
  },
};

if (config.jwtSecret.length < 32) {
  console.error("FATAL: JWT_SECRET must be set in backend/.env and be at least 32 characters long.");
  process.exit(1);
}

module.exports = config;
