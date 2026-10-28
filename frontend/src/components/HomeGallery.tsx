"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import SectionHeading from "./SectionHeading";

type Item = { id: string; type: "image" | "video"; caption: string; url: string };
const FIRST_BATCH = 6;

/**
 * Photos / videos uploaded by the admin (Admin panel → Add Photos / Videos).
 * Sits right below the hero. If nothing has been uploaded (or the API is unreachable) it renders nothing,
 * so the page layout is exactly the same as before.
 */
export default function HomeGallery() {
  const [items, setItems] = useState<Item[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [zoom, setZoom] = useState<Item | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/media")
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => !cancelled && Array.isArray(list) && setItems(list))
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoom(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom]);

  if (items.length === 0) return null;
  const visible = showAll ? items : items.slice(0, FIRST_BATCH);

  return (
    <section className="section-y bg-mist" aria-label="Photo and video gallery">
      <div className="container-jfi">
        <SectionHeading eyebrow="Gallery" title="Moments from Our Work" />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <li key={item.id} className="card card-hover overflow-hidden">
              <div className="aspect-video bg-navy-900">
                {item.type === "video" ? (
                  <video src={item.url} controls playsInline preload="metadata" className="h-full w-full object-contain" aria-label={item.caption || "Video"} />
                ) : (
                  <button type="button" onClick={() => setZoom(item)} className="block h-full w-full cursor-zoom-in" aria-label={`View larger: ${item.caption || "photo"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt={item.caption || "JFI activity photo"} loading="lazy" className="h-full w-full object-cover" />
                  </button>
                )}
              </div>
              {item.caption && <p className="p-4 text-[15px] font-medium text-ink">{item.caption}</p>}
            </li>
          ))}
        </ul>

        {items.length > FIRST_BATCH && !showAll && (
          <div className="mt-8 text-center">
            <button type="button" onClick={() => setShowAll(true)} className="btn-outline">View more ({items.length - FIRST_BATCH})</button>
          </div>
        )}
      </div>

      {zoom && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-900/90 p-4" role="dialog" aria-modal="true" aria-label={zoom.caption || "Photo"} onClick={() => setZoom(null)}>
          <button type="button" onClick={() => setZoom(null)} aria-label="Close" className="absolute right-4 top-4 rounded-full bg-white/15 p-2 text-white hover:bg-white/25">
            <X className="h-6 w-6" />
          </button>
          <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={zoom.url} alt={zoom.caption || "JFI activity photo"} className="max-h-[80vh] w-auto max-w-full rounded-lg object-contain" />
            {zoom.caption && <figcaption className="mt-3 text-center text-sm text-white/90">{zoom.caption}</figcaption>}
          </figure>
        </div>
      )}
    </section>
  );
}
