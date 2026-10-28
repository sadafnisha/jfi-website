import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import { advocacyAreas } from "@/data/content";

export const metadata: Metadata = { title: "Our Key Areas of Advocacy" };

export default function KeyAreasOfAdvocacyPage() {
  return (
    <>
      <PageBanner
        title="Our Key Areas of Advocacy"
        eyebrow="Advocacy"
        subtitle="The institutional and social issues on which JFI focuses its public advocacy."
        gradient
      />
      <section className="section-y bg-mist">
        <div className="container-jfi space-y-8">
          {advocacyAreas.map((area) => (
            <article key={area.title} className="card flex flex-col gap-6 p-8 sm:flex-row sm:p-10">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-navy text-gold">
                <area.icon className="h-8 w-8" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-serif text-2xl font-bold sm:text-3xl">{area.title}</h2>
                <div className="mt-3 h-1 w-14 rounded bg-gold" aria-hidden="true" />
                <p className="mt-5 text-lg leading-relaxed text-ink/90">{area.text}</p>
              </div>
            </article>
          ))}
          <div className="pt-4 text-center">
            <Link href="/support-us" className="btn-navy">
              Support Our Work <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
