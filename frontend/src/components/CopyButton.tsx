"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type Props = {
  value: string;
  label: string;
  /** "light" for dark backgrounds, "dark" for light backgrounds. */
  tone?: "light" | "dark";
};

/** Copies text to the clipboard. It never opens a payment app or link. */
export default function CopyButton({ value, label, tone = "dark" }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false); // Clipboard blocked: the value stays visible so it can be selected manually.
    }
  }

  const colours =
    tone === "light"
      ? "border-white/30 text-white hover:border-gold hover:text-gold-light"
      : "border-navy/25 text-navy hover:border-navy hover:bg-navy hover:text-white";

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition ${colours}`}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
    >
      {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}