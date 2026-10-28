
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  gradient?: boolean;
};

export default function PageBanner({
  title,
  subtitle,
  eyebrow,
  gradient = false,
}: Props) {
  return (
    <section
      className="relative overflow-hidden bg-navy text-white"
      style={{
        background: gradient
          ? "linear-gradient(100deg, #075D25 0%, #064B2B 45%, #073A3D 75%, #071D49 100%)"
          : undefined,
      }}
    >
      {!gradient && (
        <>
          <div
            className="absolute inset-0 opacity-30"
            aria-hidden="true"
            style={{
              backgroundImage:
                "radial-gradient(circle at 85% 20%, rgba(232,162,58,0.55), transparent 45%), radial-gradient(circle at 5% 100%, rgba(39,138,67,0.55), transparent 40%)",
            }}
          />

          <div
            className="absolute inset-0 opacity-[0.07]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, #fff 0, #fff 1px, transparent 1px, transparent 14px)",
            }}
          />
        </>
      )}

      <div className="container-jfi relative py-14 sm:py-20">
        <nav
          aria-label="Breadcrumb"
          className="mb-5 text-sm text-white/70"
        >
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-gold-light">
                Home
              </Link>
            </li>

            <li aria-hidden="true">
              <ChevronRight className="h-4 w-4" />
            </li>

            <li aria-current="page" className="text-gold-light">
              {title}
            </li>
          </ol>
        </nav>

        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold-light">
            {eyebrow}
          </p>
        )}

        <h1 className="max-w-3xl animate-fade-up font-serif text-3xl font-bold !text-white sm:text-5xl">
          {title}
        </h1>

        <div
          className="mt-5 h-1 w-20 rounded bg-gold"
          aria-hidden="true"
        />

        {subtitle && (
          <p className="mt-5 max-w-2xl text-lg text-white/80">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
