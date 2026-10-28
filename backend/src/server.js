const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const config = require("./config");
const publicRoutes = require("./routes/public");
const adminRoutes = require("./routes/admin");
const mediaRoutes = require("./routes/media");
const { router: donationRoutes, webhookRouter } = require("./routes/donations");

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1); // behind Next.js rewrite / nginx: use the real client IP for rate limits

app.use(helmet());
app.use(cors({ origin: config.frontendUrl, credentials: true }));

// Razorpay webhook needs the RAW body to check the signature -> must come BEFORE express.json()
app.use("/api/donations/webhook", express.raw({ type: "application/json", limit: "1mb" }), webhookRouter);

app.use(express.json({ limit: "50kb" }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => res.json({ ok: true, db: mongoose.connection.readyState === 1 }));
app.use("/api", publicRoutes); // POST /api/join-us
app.use("/api/media", mediaRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api", (_req, res) => res.status(404).json({ message: "Not found." }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.status && err.status < 500 ? err.message : "Something went wrong." });
});

mongoose
  .connect(config.mongoUri)
  .then(() => {
    app.listen(config.port, () => console.log(`JFI backend running on http://localhost:${config.port}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });