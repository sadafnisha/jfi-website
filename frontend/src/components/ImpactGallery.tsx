"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { formatImpactDate, type ImpactGalleryImage } from "@/data/impact";
import SafeImage from "./SafeImage";

const ALL = "All";

export default function ImpactGallery({ images }: { images: ImpactGalleryImage[] }) {
  const [category, setCategory] = useState(ALL);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  const categories = useMemo(() => [ALL, ...Array.from(new Set(images.map((image) => image.category)))], [images]);
  const visible = useMemo(
    () => (category === ALL ? images : images.filter((image) => image.category === category)),
    [images, category],
  );

  const isOpen = openIndex !== null;

  // Open / close the native <dialog> (gives focus trapping and Esc-to-close for free).
  // Depends only on open/closed, so stepping between photos does not re-run it.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function close() {
    setOpenIndex(null);
    lastTriggerRef.current?.focus();
  }

  function step(direction: 1 | -1) {
    setOpenIndex((current) => (current === null ? null : (current + direction + visible.length) % visible.length));
  }

  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  }

  const current = openIndex !== null ? visible[openIndex] : undefined;
  const currentDate = formatImpactDate(current?.date);

  return (
    <div>
      {categories.length > 2 && (
        <div role="group" aria-label="Filter photographs by category" className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((name) => {
            const active = name === category;
            return (
              <button
                key={name}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(name)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "border-navy bg-navy text-white"
                    : "border-navy/25 bg-white text-navy hover:border-navy hover:bg-navy/5"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      )}

      <ul className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((image, index) => (
          <li key={image.id}>
            <button
              type="button"
              onClick={(event) => {
                lastTriggerRef.current = event.currentTarget;
                setOpenIndex(index);
              }}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-navy shadow-card"
              aria-label={`View larger: ${image.alt}`}
            >
              <div className="h-full w-full transition duration-500 group-hover:scale-105">
                <SafeImage src={image.src} alt={image.alt} />
              </div>
              <span className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-navy-900/80 via-transparent to-transparent p-3 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="flex w-full items-center justify-between gap-2 text-left text-xs font-medium text-white">
                  <span className="line-clamp-2">{image.caption ?? image.category}</span>
                  <Expand className="h-4 w-4 shrink-0 text-gold-light" aria-hidden="true" />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* Lightbox */}
      <dialog
        ref={dialogRef}
        aria-label="Photograph viewer"
        onClose={() => setOpenIndex(null)}
        onKeyDown={onKeyDown}
        onClick={(event) => {
          // A click on the dark backdrop (outside the content box) closes the viewer.
          if (event.target === event.currentTarget) close();
        }}
        className="m-auto max-h-[96vh] w-[96vw] max-w-5xl overflow-hidden rounded-xl bg-transparent p-0 text-white backdrop:bg-black/85"
      >
        {current && (
          <div className="flex h-[min(92vh,52rem)] flex-col bg-navy-900">
            <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3">
              <p className="text-sm font-medium text-white/80" aria-live="polite">
                {(openIndex ?? 0) + 1} / {visible.length}
                <span className="ml-3 rounded-full bg-gold px-2.5 py-0.5 text-xs font-semibold text-navy">
                  {current.category}
                </span>
              </p>
              <button
                type="button"
                onClick={close}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white hover:bg-white/10"
                aria-label="Close photograph viewer"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="relative min-h-0 flex-1 bg-black/40">
              <div className="absolute inset-0">
                <SafeImage src={current.src} alt={current.alt} fit="contain" />
              </div>
              {visible.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    className="absolute left-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-navy/80 text-white hover:bg-navy"
                    aria-label="Previous photograph"
                  >
                    <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    className="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-navy/80 text-white hover:bg-navy"
                    aria-label="Next photograph"
                  >
                    <ChevronRight className="h-6 w-6" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>

            {(current.caption || currentDate) && (
              <div className="shrink-0 px-4 py-3 text-sm text-white/85">
                {current.caption && <p>{current.caption}</p>}
                {currentDate && <p className="mt-1 text-xs text-white/60">{currentDate}</p>}
              </div>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}
