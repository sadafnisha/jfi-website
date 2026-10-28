const jwt = require("jsonwebtoken");
const config = require("../config");
const Admin = require("../models/Admin");

const COOKIE = "jfi_admin";
const MAX_AGE_MS = 8 * 60 * 60 * 1000; // 8 hours

function cookieOptions() {
  return {
    httpOnly: true, // JavaScript on the page can never read the token
    sameSite: "strict", // not sent on cross-site requests (CSRF protection)
    secure: config.isProd, // HTTPS only in production
    path: "/",
    maxAge: MAX_AGE_MS,
  };
}

function issueToken(res, admin) {
  const token = jwt.sign({ sub: String(admin._id), role: "admin" }, config.jwtSecret, {
    expiresIn: "8h",
    algorithm: "HS256",
  });
  res.cookie(COOKIE, token, cookieOptions());
}

function clearToken(res) {
  res.clearCookie(COOKIE, { ...cookieOptions(), maxAge: undefined });
}

async function requireAdmin(req, res, next) {
  try {
    const token = req.cookies && req.cookies[COOKIE];
    if (!token) return res.status(401).json({ message: "Please log in." });
    const payload = jwt.verify(token, config.jwtSecret, { algorithms: ["HS256"] });
    const admin = await Admin.findById(payload.sub).select("email");
    if (!admin) return res.status(401).json({ message: "Please log in." });
    req.admin = admin;
    next();
  } catch {
    res.status(401).json({ message: "Session expired. Please log in again." });
  }
}

module.exports = { issueToken, clearToken, requireAdmin };
