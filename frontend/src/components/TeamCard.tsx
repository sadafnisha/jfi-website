"use client";

import { useEffect, useRef, useState } from "react";
import type { TeamMember } from "@/data/teamMembers";

function initials(name: string) {
  return name
    .replace(/^(dr|mr|mrs|ms|prof|chaudhry)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

type Props = {
  member: TeamMember;
  /** Compact cards show a shorter biography (used on the homepage preview). */
  compact?: boolean;
};

export default function TeamCard({ member, compact = false }: Props) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // If the image failed before React hydrated, onError would have been missed.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setFailed(true);
    }
  }, []);

  return (
    <article className="card card-hover flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/4] w-full overflow-hidden bg-navy">
        {failed ? (
          <div
            role="img"
            aria-label={`Photograph of ${member.name} to be added`}
            className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-navy via-navy-700 to-navy-900"
          >
            <span className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-gold bg-white/10 font-serif text-4xl font-bold text-gold-light">
              {initials(member.name)}
            </span>
            <span className="px-4 text-center text-sm font-medium text-white/80">{member.name}</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={imgRef}
            src={member.image}
            alt={`Photograph of ${member.name}, ${member.role}`}
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover object-top"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-gold via-white to-brand-green" aria-hidden="true" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-xl font-bold">{member.name}</h3>
        <p className="mt-1 text-sm font-semibold text-brand-green">{member.role}</p>
        <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink/85">
          {(compact ? member.bio.slice(0, 1) : member.bio).map((paragraph) => (
            <p key={paragraph} className={compact ? "line-clamp-4" : undefined}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
