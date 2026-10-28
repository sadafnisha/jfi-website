"use client";

import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import { isSafeHref, isValidYouTubeId, type ImpactVideo } from "@/data/impact";
import SafeImage from "./SafeImage";

/**
 * Video card. Nothing loads or plays until the visitor presses the play button
 * (no autoplay on page load, so no surprise sound and no wasted data).
 */
export default function VideoCard({ video }: { video: ImpactVideo }) {
  const [playing, setPlaying] = useState(false);
  const { source } = video;

  const youtubeOk = source.type === "youtube" && isValidYouTubeId(source.id);
  const fileOk = source.type === "file" && source.src.startsWith("/") && !source.src.startsWith("//");
  const linkOk = source.type === "link" && isSafeHref(source.url) && source.url.startsWith("https://");

  const overlay = (
    <>
      <SafeImage src={video.thumbnail} alt={`Thumbnail for ${video.title}`} missingLabel="Thumbnail to be added" />
      <span className="absolute inset-0 flex items-center justify-center bg-navy-900/30 transition group-hover:bg-navy-900/45">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-navy shadow-lift transition group-hover:scale-110">
          {linkOk ? (
            <ExternalLink className="h-7 w-7" aria-hidden="true" />
          ) : (
            <Play className="h-7 w-7 translate-x-0.5" aria-hidden="true" />
          )}
        </span>
      </span>
    </>
  );

  return (
    <article className="card flex h-full flex-col overflow-hidden">
      <div className="relative aspect-video w-full bg-black">
        {playing && fileOk && source.type === "file" ? (
          <video
            className="h-full w-full bg-black"
            controls
            autoPlay
            playsInline
            preload="metadata"
            poster={video.thumbnail}
            aria-label={video.title}
          >
            <source src={source.src} />
            Your browser cannot play this video.
          </video>
        ) : playing && youtubeOk && source.type === "youtube" ? (
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${source.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : linkOk && source.type === "link" ? (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group absolute inset-0 block"
            aria-label={`Watch video: ${video.title} (opens in a new tab)`}
          >
            {overlay}
          </a>
        ) : fileOk || youtubeOk ? (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 block w-full"
            aria-label={`Play video: ${video.title}`}
          >
            {overlay}
          </button>
        ) : (
          // Source missing or invalid: show the thumbnail only, with no play control.
          <SafeImage src={video.thumbnail} alt={`Thumbnail for ${video.title}`} missingLabel="Video to be added" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-lg font-bold leading-snug">{video.title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-ink/85">{video.description}</p>
        {linkOk && source.type === "link" && (
          <p className="mt-3 text-xs font-medium text-ink/70">Opens in a new tab</p>
        )}
      </div>
    </article>
  );
}
