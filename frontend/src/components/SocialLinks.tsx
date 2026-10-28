import { socialLinks } from "@/data/site";

type Props = {
  /** "light" is for dark backgrounds (footer); "dark" for light backgrounds. */
  tone?: "light" | "dark";
};

/**
 * Renders social links. Entries without an official URL are shown as clearly
 * marked, non-clickable placeholders so that no invented URL is ever used.
 */
export default function SocialLinks({ tone = "dark" }: Props) {
  const base =
    "inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold transition";
  const live =
    tone === "light"
      ? "border-white/30 text-white hover:border-gold hover:text-gold-light"
      : "border-navy/25 text-navy hover:border-navy hover:bg-navy hover:text-white";
  const placeholder =
    tone === "light"
      ? "border-dashed border-white/25 text-white/60"
      : "border-dashed border-navy/25 text-ink/60";

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Social media">
      {socialLinks.map((social) =>
        social.url ? (
          <li key={social.label}>
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${base} ${live}`}
              aria-label={`${social.label} (opens in a new tab)`}
            >
              {social.label}
            </a>
          </li>
        ) : (
          <li key={social.label}>
            <span
              className={`${base} ${placeholder} cursor-not-allowed`}
              title={`Official ${social.label} link to be added`}
              aria-label={`${social.label}: official link to be added`}
            >
              {social.label}
              <span className="ml-1.5 text-[10px] font-normal uppercase tracking-wide opacity-80">
                link to be added
              </span>
            </span>
          </li>
        )
      )}
    </ul>
  );
}
