"use client";

import { type FormEvent, useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayOptions = {
  key: string; amount: number; currency: string; order_id: string; name: string; description: string;
  prefill: { name: string; email: string; contact: string }; theme: { color: string };
  handler: (r: RazorpayResponse) => void; modal: { ondismiss: () => void };
};
declare global {
  interface Window {
    Razorpay?: new (o: RazorpayOptions) => { open: () => void; on: (e: string, cb: (r: { error?: { description?: string } }) => void) => void };
  }
}

const PRESETS = [500, 1000, 2500, 5000];
const input =
  "mt-1 block w-full rounded-md border border-white/25 bg-white px-3.5 py-2.5 text-base text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-gold";
const label = "block text-sm font-semibold text-white";

function loadCheckout(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

async function post<T>(url: string, body: unknown): Promise<T & { message?: string }> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong. Please try again.");
  return data;
}

export default function DonatePayment() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [amount, setAmount] = useState<number | "">(1000);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err" | "info"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/donations/config")
      .then((r) => r.json())
      .then((c) => setEnabled(Boolean(c.enabled)))
      .catch(() => setEnabled(false));
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const form = e.currentTarget;
    const f = new FormData(form);
    const donor = {
      name: String(f.get("name") || "").trim(),
      email: String(f.get("email") || "").trim(),
      phone: String(f.get("phone") || "").trim(),
      pan: String(f.get("pan") || "").trim(),
      message: String(f.get("message") || "").trim(),
      amount,
    };
    if (!Number.isInteger(amount) || (amount as number) < 1) return setMsg({ type: "err", text: "Enter a whole-rupee amount of ₹1 or more." });

    setBusy(true);
    try {
      if (!(await loadCheckout()) || !window.Razorpay) throw new Error("Could not load the payment window. Check your internet connection.");

      // The server creates the order and fixes the amount. Nothing is "paid" until the server confirms it.
      const order = await post<{ orderId: string; amount: number; currency: string; keyId: string }>("/api/donations/create-order", donor);

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "Justice Front of India",
        description: "Donation",
        prefill: { name: donor.name, email: donor.email, contact: donor.phone },
        theme: { color: "#171D55" },
        modal: { ondismiss: () => { setBusy(false); setMsg({ type: "info", text: "Payment window closed. No amount was taken unless you completed the payment." }); } },
        handler: async (response) => {
          setMsg({ type: "info", text: "Confirming your payment… please do not close this page." });
          try {
            const result = await post<{ status: string }>("/api/donations/verify", response);
            setMsg({ type: result.status === "paid" ? "ok" : "info", text: result.message || "Payment received." });
            if (result.status === "paid") form.reset();
          } catch (err) {
            setMsg({ type: "err", text: err instanceof Error ? err.message : "Could not confirm the payment." });
          }
          setBusy(false);
        },
      });
      rzp.on("payment.failed", (r) => setMsg({ type: "err", text: r.error?.description || "Payment failed. You can try again." }));
      rzp.open();
    } catch (err) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "Could not start the payment." });
      setBusy(false);
    }
  }

  if (enabled === false) {
    return (
      <p role="status" className="rounded-lg border border-gold/50 bg-gold/10 p-4 text-sm leading-relaxed text-white">
        Online donations are not available right now. Please contact the JFI office to donate.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <fieldset>
        <legend className={label}>Amount (₹) *</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p} type="button" onClick={() => setAmount(p)} aria-pressed={amount === p}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${amount === p ? "border-gold bg-gold text-navy" : "border-white/30 text-white hover:bg-white/10"}`}>
              ₹{p.toLocaleString("en-IN")}
            </button>
          ))}
        </div>
        <input aria-label="Custom amount in rupees" className={input} type="number" inputMode="numeric" min={1} max={500000} step={1} placeholder="Or enter another amount"
          value={amount} onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))} required />
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={label} htmlFor="d-name">Full name *</label><input id="d-name" name="name" className={input} required minLength={2} maxLength={100} autoComplete="name" /></div>
        <div><label className={label} htmlFor="d-phone">Mobile number *</label>
          <input id="d-phone" name="phone" className={input} required inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10} autoComplete="tel-national" placeholder="10 digits"
            onChange={(e) => (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "").slice(0, 10))} /></div>
      </div>
      <div><label className={label} htmlFor="d-email">Email *</label><input id="d-email" name="email" type="email" className={input} required maxLength={254} autoComplete="email" /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={label} htmlFor="d-pan">PAN (optional)</label>
          <input id="d-pan" name="pan" className={`${input} uppercase`} maxLength={10} pattern="[A-Za-z]{5}[0-9]{4}[A-Za-z]" placeholder="ABCDE1234F" /></div>
        <div><label className={label} htmlFor="d-msg">Message (optional)</label><input id="d-msg" name="message" className={input} maxLength={500} /></div>
      </div>

      {msg && (
        <p role={msg.type === "err" ? "alert" : "status"}
          className={`flex items-start gap-2 rounded-md p-3 text-sm ${msg.type === "ok" ? "bg-brand-green/20 text-white" : msg.type === "err" ? "bg-red-100 text-red-800" : "bg-white/10 text-white"}`}>
          {msg.type === "ok" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : msg.type === "err" ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : null}
          {msg.text}
        </p>
      )}

      <button type="submit" disabled={busy || enabled === null} className="btn-gold w-full disabled:cursor-not-allowed disabled:opacity-60">
        {busy ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Please wait…</> : "Donate securely"}
      </button>
      <p className="flex items-start gap-2 text-xs leading-5 text-white/75">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" aria-hidden="true" />
        You will pay in Razorpay&apos;s secure window by UPI (QR or app), card or net banking. Your donation is recorded only after the payment is confirmed by the payment gateway.
      </p>
    </form>
  );
}
