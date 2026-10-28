import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { allPages, site } from "@/data/site";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="h-1 bg-gradient-to-r from-gold via-white to-brand-green" aria-hidden="true" />
      <div className="container-jfi grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3">
            <Image
              src={site.logo}
              alt="Justice Front of India logo"
              width={64}
              height={64}
              className="h-16 w-16 rounded-full bg-white p-0.5"
            />
            <div>
              <p className="font-serif text-xl font-bold">{site.name}</p>
              <p className="text-xs uppercase tracking-[0.25em] text-gold-light">{site.shortName}</p>
            </div>
          </div>
          <p className="mt-5 max-w-sm font-serif text-lg italic leading-relaxed text-white/85">
            “{site.tagline}”
          </p>
        </div>

        <nav aria-label="Footer navigation" className="lg:col-span-4">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-widest text-gold !text-gold">
            Explore
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            {allPages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="text-white/80 transition hover:text-gold-light">
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-widest !text-gold">
            Head Office
          </h2>
          <address className="mt-4 flex gap-3 text-sm not-italic leading-relaxed text-white/80">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
            <span>
              {site.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </span>
          </address>
          <ul className="mt-4 space-y-2 text-sm">
            {site.phones.map((phone) => (
              <li key={phone.href} className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                <a href={phone.href} className="text-white/90 hover:text-gold-light">
                  {phone.display}
                </a>
              </li>
            ))}
          </ul>
          <h2 className="mt-7 font-sans text-sm font-semibold uppercase tracking-widest !text-gold">
            Follow
          </h2>
          <div className="mt-3">
            <SocialLinks tone="light" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-jfi flex flex-col gap-2 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name} ({site.shortName}). All rights reserved.
          </p>
          <p>Standing for Justice, Defending Rights, Empowering People.</p>
        </div>
      </div>
    </footer>
  );
}
