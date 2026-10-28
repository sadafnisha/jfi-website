import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/data/site";

/**
 * Homepage Hero.
 *
 * The originally approved Hero was not available when this project was built,
 * so this is a newly created, separate component that uses the exact
 * organization name and tagline. It is intentionally self-contained: replace
 * or swap this single file to restore the approved design without touching
 * any other part of the site.
 */
export default function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden text-white"
      style={{
        background:
          "linear-gradient(100deg, #075D25 0%, #064B2B 45%, #073A3D 75%, #071D49 100%)",
      }}
      aria-labelledby="hero-title"
    >
          <div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 80% 30%, rgba(232,162,58,0.28), transparent 50%), radial-gradient(ellipse at 0% 100%, rgba(39,138,67,0.40), transparent 45%)",
        }}
      />
      {/* <div
        className="absolute inset-0 -z-10 opacity-[0.06]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #fff 0, #fff 1px, transparent 1px, transparent 16px)",
        }}
      /> */}

      <div className="container-jfi grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-12 lg:py-28">
        <div className="animate-fade-up lg:col-span-7">
          <p className="mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold-light">
            <span className="h-px w-10 bg-gold" aria-hidden="true" />
            {site.shortName}
          </p>
          <h1
            id="hero-title"
            className="font-serif text-4xl font-bold leading-tight !text-white sm:text-5xl lg:text-6xl"
          >
            {site.name}
          </h1>
          <p className="mt-6 max-w-2xl font-serif text-xl italic leading-relaxed text-gold-light sm:text-2xl">
            “{site.tagline}”
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/about-us" className="btn-gold">
              Learn About JFI <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/support-us" className="btn-outline-light">
              Support Us
            </Link>
            <Link href="/contact-us" className="btn-outline-light">
              Contact Us
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:col-span-5 lg:justify-end">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full border border-gold/40" aria-hidden="true" />
            <div className="absolute -inset-8 rounded-full border border-white/10" aria-hidden="true" />
            <Image
              src={site.logo}
              alt="Justice Front of India official logo"
              width={380}
              height={380}
              priority
              className="relative h-64 w-64 rounded-full bg-white p-1.5 shadow-lift sm:h-80 sm:w-80 lg:h-[22rem] lg:w-[22rem]"
            />
          </div>
        </div>
      </div>
      <div className="h-1.5 bg-gradient-to-r from-gold via-white to-brand-green" aria-hidden="true" />
    </section>
  );
}
