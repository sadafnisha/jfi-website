"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { isGroup, navigation, site } from "@/data/site";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close menus whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  // Close dropdowns on outside click or Escape.
  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenGroup(null);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenGroup(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top information strip */}
      <div className="hidden bg-navy text-white md:block">
        <div className="container-jfi flex items-center justify-between py-2 text-xs">
          <p className="text-white/80">{site.tagline}</p>
          <div className="flex items-center gap-5">
            {site.phones.map((phone) => (
              <a
                key={phone.href}
                href={phone.href}
                className="inline-flex items-center gap-1.5 font-medium text-gold-light hover:text-white"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                {phone.display}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-b-2 border-gold">
        <div className="container-jfi flex items-center justify-between gap-4 py-2.5">
          <Link href="/" className="flex items-center gap-3" aria-label="Justice Front of India – Home">
            <Image
              src={site.logo}
              alt="Justice Front of India official logo"
              width={56}
              height={56}
              priority
              className="h-12 w-12 sm:h-14 sm:w-14"
            />
            <span className="leading-tight">
              <span className="block font-serif text-base font-bold text-navy sm:text-xl">
                {site.name}
              </span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-green">
                Serving Humanity · Upholding Law
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Main navigation" className="hidden xl:block">
            <div ref={navRef}>
              <ul className="flex items-center gap-1">
                {navigation.map((entry) => {
                  if (isGroup(entry)) {
                    const groupActive = entry.items.some((item) => isActive(item.href));
                    const open = openGroup === entry.label;
                    return (
                      <li
                        key={entry.label}
                        className="relative"
                        onMouseEnter={() => setOpenGroup(entry.label)}
                        onMouseLeave={() => setOpenGroup(null)}
                      >
                        <button
                          type="button"
                          aria-expanded={open}
                          aria-haspopup="true"
                          onClick={() => setOpenGroup(open ? null : entry.label)}
                          className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition hover:bg-mist hover:text-navy ${
                            groupActive ? "text-navy" : "text-ink"
                          }`}
                        >
                          {entry.label}
                          <ChevronDown
                            className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
                            aria-hidden="true"
                          />
                        </button>
                        {groupActive && (
                          <span className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-gold" aria-hidden="true" />
                        )}
                        {open && (
                          <ul className="absolute left-0 top-full z-50 w-64 rounded-lg border border-navy/10 bg-white py-2 shadow-lift">
                            {entry.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  aria-current={isActive(item.href) ? "page" : undefined}
                                  onClick={() => setOpenGroup(null)}
                                  className={`block px-4 py-2 text-sm font-medium hover:bg-mist hover:text-navy ${
                                    isActive(item.href) ? "bg-mist text-navy" : "text-ink"
                                  }`}
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  }

                  const active = isActive(entry.href);
                  const isCta = entry.href === "/support-us";
                  return (
                    <li key={entry.href} className="relative">
                      <Link
                        href={entry.href}
                        aria-current={active ? "page" : undefined}
                        className={
                          isCta
                            ? "ml-2 inline-flex rounded-md bg-gold px-4 py-2 text-sm font-semibold text-navy transition hover:bg-gold-light"
                            : `inline-flex rounded-md px-3 py-2 text-sm font-semibold transition hover:bg-mist hover:text-navy ${
                                active ? "text-navy" : "text-ink"
                              }`
                        }
                      >
                        {entry.label}
                      </Link>
                      {active && !isCta && (
                        <span className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-gold" aria-hidden="true" />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-navy hover:bg-mist xl:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {mobileOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="max-h-[80vh] overflow-y-auto border-b border-navy/10 bg-white xl:hidden"
        >
          <ul className="container-jfi space-y-1 py-4">
            {navigation.map((entry) =>
              isGroup(entry) ? (
                <li key={entry.label} className="pt-2">
                  <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-widest text-brand-green">
                    {entry.label}
                  </p>
                  <ul>
                    {entry.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={isActive(item.href) ? "page" : undefined}
                          className={`block rounded-md px-3 py-2.5 text-base font-medium hover:bg-mist ${
                            isActive(item.href) ? "bg-mist text-navy" : "text-ink"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={entry.href}>
                  <Link
                    href={entry.href}
                    aria-current={isActive(entry.href) ? "page" : undefined}
                    className={`block rounded-md px-3 py-2.5 text-base font-semibold hover:bg-mist ${
                      isActive(entry.href) ? "bg-mist text-navy" : "text-ink"
                    }`}
                  >
                    {entry.label}
                  </Link>
                </li>
              )
            )}
            <li className="flex flex-wrap gap-3 border-t border-navy/10 px-3 pt-4">
              {site.phones.map((phone) => (
                <a
                  key={phone.href}
                  href={phone.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-navy"
                >
                  <Phone className="h-4 w-4 text-brand-green" aria-hidden="true" />
                  {phone.display}
                </a>
              ))}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
