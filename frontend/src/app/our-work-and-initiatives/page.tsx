import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import { initiatives } from "@/data/content";

export const metadata: Metadata = { title: "Our Work and Initiatives" };

export default function WorkAndInitiativesPage() {
  return (
    <>
      <PageBanner
        title="Our Work and Initiatives"
        eyebrow="What We Do"
        subtitle="Four ways JFI works to make justice accessible."
        gradient
      />
      <section className="section-y bg-white">
        <div className="container-jfi space-y-8">
          {initiatives.map((item, index) => (
            <article
              key={item.title}
              className="card card-hover grid gap-6 overflow-hidden p-0 md:grid-cols-12"
            >
              <div className="flex items-center gap-4 bg-navy p-8 text-white md:col-span-4 md:flex-col md:items-start md:justify-between">
                <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-gold text-navy">
                  <item.icon className="h-8 w-8" aria-hidden="true" />
                </span>
                <span className="font-serif text-5xl font-bold text-white/25" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-8 md:col-span-8">
                <h2 className="font-serif text-2xl font-bold sm:text-3xl">{item.title}</h2>
                <div className="mt-3 h-1 w-14 rounded bg-gold" aria-hidden="true" />
                <p className="mt-5 text-lg leading-relaxed text-ink/90">{item.text}</p>
              </div>
            </article>
          ))}
          <div className="pt-4 text-center">
            <Link href="/key-areas-of-advocacy" className="btn-navy">
              Our Key Areas of Advocacy <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
