import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  title: string;
  text: string;
  /** "light" on white/mist sections, "dark" on the navy section. */
  tone?: "light" | "dark";
};

/** Tidy "coming soon" panel shown while JFI has not yet supplied verified material. */
export default function ImpactPlaceholder({ icon: Icon, title, text, tone = "light" }: Props) {
  const dark = tone === "dark";
  return (
    <div
      className={`mx-auto flex max-w-2xl flex-col items-center rounded-xl border-2 border-dashed px-6 py-10 text-center sm:px-10 ${
        dark ? "border-gold/50 bg-white/5" : "border-gold/60 bg-white"
      }`}
    >
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-full ${
          dark ? "bg-white/10 text-gold" : "bg-navy text-gold"
        }`}
      >
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h3 className={`mt-5 font-serif text-xl font-bold ${dark ? "!text-white" : ""}`}>{title}</h3>
      <p className={`mt-2 max-w-md text-[15px] leading-relaxed ${dark ? "text-white/75" : "text-ink/80"}`}>{text}</p>
    </div>
  );
}
