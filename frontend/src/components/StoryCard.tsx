import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { formatImpactDate, isSafeHref, type ImpactStory } from "@/data/impact";
import SafeImage from "./SafeImage";

export default function StoryCard({ story }: { story: ImpactStory }) {
  const date = formatImpactDate(story.date);
  const external = story.href?.startsWith("https://");

  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy">
        <div className="h-full w-full transition duration-500 group-hover:scale-105">
          <SafeImage src={story.image} alt={story.imageAlt ?? story.title} />
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-navy shadow-card">
          {story.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {date && (
          <p className="flex items-center gap-1.5 text-xs font-medium text-ink/70">
            <CalendarDays className="h-4 w-4 text-brand-green" aria-hidden="true" />
            <time dateTime={story.date}>{date}</time>
          </p>
        )}
        <h3 className="mt-2 font-serif text-xl font-bold leading-snug">{story.title}</h3>
        <p className="mt-3 line-clamp-4 text-[15px] leading-relaxed text-ink/85">{story.summary}</p>

        {isSafeHref(story.href) && (
          <div className="mt-auto pt-5">
            {external ? (
              <a
                href={story.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline px-5 py-2.5"
                aria-label={`Read story: ${story.title} (opens in a new tab)`}
              >
                Read Story <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : (
              <Link href={story.href} className="btn-outline px-5 py-2.5" aria-label={`Read story: ${story.title}`}>
                Read Story <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
