import type { Metadata } from "next";
import Image from "next/image";
import PageBanner from "@/components/PageBanner";
import { aboutParagraphs, aboutPrinciple } from "@/data/content";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "About Us" };

export default function AboutUsPage() {
  return (
    <>
      <PageBanner title="About Us" eyebrow="Justice Front of India" subtitle="Who we are and why we exist." gradient/>
      <section className="section-y bg-white">
        <div className="container-jfi grid gap-12 lg:grid-cols-12">
          <div className="space-y-6 text-lg leading-relaxed text-ink/90 lg:col-span-8">
            {aboutParagraphs.map((paragraph, index) => (
              <p key={paragraph} className={index === 0 ? "first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.9] first-letter:text-navy" : undefined}>
                {paragraph}
              </p>
            ))}
            <blockquote className="mt-4 rounded-r-xl border-l-4 border-gold bg-mist p-7 font-serif text-2xl leading-snug text-navy">
              {aboutPrinciple}
            </blockquote>
          </div>
          <aside className="lg:col-span-4" aria-label="Organization emblem">
            <div className="card sticky top-32 flex flex-col items-center p-8 text-center">
              <Image
                src={site.logo}
                alt="Justice Front of India official logo"
                width={240}
                height={240}
                className="h-56 w-56"
              />
              <p className="mt-4 font-serif text-xl font-bold text-navy">{site.name}</p>
              <p className="mt-2 text-sm italic text-ink/75">{site.tagline}</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
