const crypto = require("crypto");
const express = require("express");
const rateLimit = require("express-rate-limit");
const Razorpay = require("razorpay");
const config = require("../config");
const Donation = require("../models/Donation");
const { str, PHONE, EMAIL } = require("../utils/validate");

const router = express.Router();
const webhookRouter = express.Router();

const razorpayReady = Boolean(config.razorpay.keyId && config.razorpay.keySecret);
const razorpay = razorpayReady
  ? new Razorpay({ key_id: config.razorpay.keyId, key_secret: config.razorpay.keySecret })
  : null;

const MIN_RUPEES = 1;
const MAX_RUPEES = 500000;

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in a few minutes." },
});

function safeEqualHex(a, b) {
  const A = Buffer.from(String(a), "utf8");
  const B = Buffer.from(String(b), "utf8");
  return A.length === B.length && crypto.timingSafeEqual(A, B);
}

/**
 * THE ONLY place a donation becomes "paid".
 * It trusts nothing from the browser: the payment record comes from Razorpay's server
 * (API fetch or signed webhook) and must match the order id AND the amount we stored.
 */
async function settlePayment(payment, verifiedBy) {
  if (!payment || !payment.order_id) return null;
  const donation = await Donation.findOne({ razorpayOrderId: payment.order_id });
  if (!donation) return null;
  if (donation.status === "paid") return donation; // idempotent: webhook + browser can both arrive

  if (Number(payment.amount) !== donation.amountPaise || payment.currency !== donation.currency) {
    console.error(`Amount mismatch for order ${payment.order_id}: expected ${donation.amountPaise}, got ${payment.amount}`);
    return donation;
  }

  let current = payment;
  if (payment.status === "authorized" && razorpay) {
    // Account is on manual capture: capture it now.
    current = await razorpay.payments.capture(payment.id, donation.amountPaise, donation.currency);
  }
  if (current.status !== "captured") return donation;

  return Donation.findOneAndUpdate(
    { _id: donation._id, status: { $ne: "paid" } },
    {
      status: "paid",
      razorpayPaymentId: current.id,
      method: current.method || "",
      paymentVpa: current.vpa || "",
      paidAt: new Date(),
      verifiedBy,
      failureReason: "",
    },
    { new: true }
  );
}

// GET /api/donations/config  -> tells the page whether online payment is available
router.get("/config", (_req, res) => {
  res.json({ enabled: razorpayReady, keyId: razorpayReady ? config.razorpay.keyId : null, minAmount: MIN_RUPEES, maxAmount: MAX_RUPEES });
});

// POST /api/donations/create-order
router.post("/create-order", orderLimiter, async (req, res) => {
  try {
    if (!razorpayReady) return res.status(503).json({ message: "Online donations are not available right now." });

    const b = req.body || {};
    const donorName = str(b.name, 100);
    const email = str(b.email, 254).toLowerCase();
    const phone = str(b.phone, 10);
    const pan = str(b.pan, 10).toUpperCase();
    const message = str(b.message, 500);
    const rupees = Number(b.amount);

    if (donorName.length < 2) return res.status(400).json({ message: "Enter your name." });
    if (!EMAIL.test(email)) return res.status(400).json({ message: "Enter a valid email address." });
    if (!PHONE.test(phone)) return res.status(400).json({ message: "Enter a valid 10-digit mobile number." });
    if (pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) return res.status(400).json({ message: "Enter a valid PAN or leave it blank." });
    if (!Number.isInteger(rupees) || rupees < MIN_RUPEES || rupees > MAX_RUPEES)
      return res.status(400).json({ message: `Amount must be a whole number between ₹${MIN_RUPEES} and ₹${MAX_RUPEES.toLocaleString("en-IN")}.` });

    const amountPaise = rupees * 100;
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: "jfi_" + crypto.randomBytes(8).toString("hex"),
      notes: { donor: donorName, purpose: "JFI donation" },
    });

    await Donation.create({ donorName, email, phone, pan, message, amountPaise, razorpayOrderId: order.id, ip: req.ip });

    res.status(201).json({ orderId: order.id, amount: amountPaise, currency: "INR", keyId: config.razorpay.keyId });
  } catch (err) {
    console.error("create-order error:", err);
    res.status(502).json({ message: "Could not start the payment. Please try again." });
  }
});

// POST /api/donations/verify   (called by the browser after Razorpay Checkout succeeds)
router.post("/verify", orderLimiter, async (req, res) => {
  try {
    if (!razorpayReady) return res.status(503).json({ message: "Online donations are not available right now." });
    const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body || {};
    if (![orderId, paymentId, signature].every((v) => typeof v === "string" && v.length > 0 && v.length < 200))
      return res.status(400).json({ message: "Invalid payment details." });

    // 1) Signature proves Razorpay (and not the browser) produced this order/payment pair.
    const expected = crypto.createHmac("sha256", config.razorpay.keySecret).update(`${orderId}|${paymentId}`).digest("hex");
    if (!safeEqualHex(expected, signature)) return res.status(400).json({ message: "Payment verification failed." });

    // 2) Double-check directly with Razorpay's servers.
    const payment = await razorpay.payments.fetch(paymentId);
    if (payment.order_id !== orderId) return res.status(400).json({ message: "Payment verification failed." });

    const donation = await settlePayment(payment, "client-signature");
    if (!donation) return res.status(404).json({ message: "Donation record not found." });

    if (donation.status === "paid") {
      return res.json({ status: "paid", message: "Thank you! Your donation has been received.", amount: donation.amountPaise / 100, paymentId: donation.razorpayPaymentId });
    }
    res.status(202).json({ status: donation.status, message: "Your payment is being confirmed. If the amount was debited it will reflect shortly." });
  } catch (err) {
    console.error("verify error:", err);
    res.status(502).json({ message: "Could not verify the payment right now. If money was debited it will be confirmed automatically." });
  }
});

// POST /api/donations/webhook   (Razorpay -> server; works even if the donor closes the browser)
// This router is mounted with express.raw() so the signature can be computed on the exact bytes.
webhookRouter.post("/", async (req, res) => {
  try {
    const secret = config.razorpay.webhookSecret;
    const signature = req.get("x-razorpay-signature");
    if (!secret || !signature || !Buffer.isBuffer(req.body)) return res.status(400).end();

    const expected = crypto.createHmac("sha256", secret).update(req.body).digest("hex");
    if (!safeEqualHex(expected, signature)) return res.status(400).end();

    const event = JSON.parse(req.body.toString("utf8"));
    const payment = event?.payload?.payment?.entity;

    if (event.event === "payment.captured" || event.event === "order.paid") {
      await settlePayment(payment, "webhook");
    } else if (event.event === "payment.failed" && payment?.order_id) {
      // never downgrade a paid donation; a failed attempt can precede a successful retry
      await Donation.updateOne(
        { razorpayOrderId: payment.order_id, status: "created" },
        { status: "failed", failureReason: String(payment.error_description || "Payment failed").slice(0, 200) }
      );
    }
    res.json({ received: true });
  } catch (err) {
    console.error("webhook error:", err);
    res.status(500).end(); // Razorpay will retry
  }
});

module.exports = { router, webhookRouter };
