"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon } from "lucide-react";

type Props = {
  src?: string;
  alt: string;
  className?: string;
  /** "cover" fills the box (cards, tiles); "contain" shows the whole picture (lightbox). */
  fit?: "cover" | "contain";
  /** Text announced when the picture is missing, for example "Photograph to be added". */
  missingLabel?: string;
};

/**
 * Image that never shows a broken-image icon: if the file is missing or fails to load
 * it renders a navy placeholder instead. Fills its parent, so give the parent a size
 * (for example an aspect-ratio class).
 */
export default function SafeImage({ src, alt, className = "", fit = "cover", missingLabel = "Photograph to be added" }: Props) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Covers an image that already failed before React attached onError.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={`${alt} (${missingLabel.toLowerCase()})`}
        className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-navy via-navy-700 to-navy-900 p-4 text-center"
      >
        <ImageIcon className="h-9 w-9 text-gold/80" aria-hidden="true" />
        <span className="text-xs font-medium text-white/70">{missingLabel}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"} ${className}`}
    />
  );
}
