// Usage: set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env, then run:  npm run seed:admin
// Creates the single admin account (or resets its password). There is NO public sign-up.
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../config");
const Admin = require("../models/Admin");

(async () => {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  if (!email || password.length < 10) {
    console.error("Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 10 characters in backend/.env first.");
    process.exit(1);
  }
  await mongoose.connect(config.mongoUri);
  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.findOneAndUpdate({ email }, { email, passwordHash, failedLogins: 0, lockedUntil: null }, { upsert: true, new: true });
  console.log(`Admin ready: ${email}`);
  console.log("Now remove ADMIN_PASSWORD from backend/.env so it is not left lying around.");
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
