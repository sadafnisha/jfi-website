"use client";

import { useState } from "react";
import { QrCode } from "lucide-react";

type Props = {
  /** Path of the official QR image, or null while it has not been supplied. */
  src: string | null;
};

/**
 * Shows the official QR code when one is configured and loads correctly.
 * Otherwise shows a NON-interactive "coming soon" placeholder. It is deliberately a plain
 * <div>: not a link, not a button, and it never starts a payment.
 */
export default function DonateQr({ src }: Props) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <figure className="mx-auto w-full max-w-[280px]">
        <div className="rounded-xl bg-white p-3 shadow-card ring-2 ring-gold">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt="Official Justice Front of India donation QR code"
            width={280}
            height={280}
            onError={() => setFailed(true)}
            className="aspect-square h-auto w-full object-contain"
          />
        </div>
        <figcaption className="mt-3 text-center text-sm font-medium text-white/85">
          Scan with a supported UPI app
        </figcaption>
      </figure>
    );
  }

  return (
    <div
      role="img"
      aria-label="Official donation QR code coming soon"
      className="mx-auto flex aspect-square w-full max-w-[280px] select-none flex-col items-center justify-center rounded-xl border-2 border-dashed border-gold/70 bg-white/5 p-6 text-center"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/60 bg-white/10 text-gold">
        <QrCode className="h-8 w-8" aria-hidden="true" />
      </span>
      <p className="mt-4 font-serif text-lg font-bold leading-snug text-white">
        Official Donation QR Code Coming Soon
      </p>
      <p className="mt-2 text-xs leading-relaxed text-white/70">
        Please do not pay using any other QR code until JFI publishes its official one here.
      </p>
    </div>
  );
}