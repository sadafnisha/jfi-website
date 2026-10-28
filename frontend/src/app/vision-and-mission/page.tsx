import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import SectionHeading from "@/components/SectionHeading";
import { missionItems, visionParagraphs } from "@/data/content";

export const metadata: Metadata = { title: "Vision and Mission" };

export default function VisionAndMissionPage() {
  return (
    <>
      <PageBanner
        title="Vision and Mission"
        eyebrow="Our Direction"
        subtitle="The India we envision and the work we undertake to move towards it."
        gradient
      />

      <section className="section-y bg-white" aria-labelledby="vision-title">
        <div className="container-jfi">
          <div className="relative overflow-hidden rounded-2xl bg-navy p-8 text-white shadow-lift sm:p-12">
            <div
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[28px] border-gold/15"
              aria-hidden="true"
            />
            <div className="relative max-w-4xl">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-navy">
                <Eye className="h-7 w-7" aria-hidden="true" />
              </span>
              <h2 id="vision-title" className="mt-6 font-serif text-3xl font-bold !text-gold-light sm:text-4xl">
                Vision
              </h2>
              <div className="mt-5 space-y-5 text-lg leading-relaxed text-white/90">
                {visionParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-mist" aria-labelledby="mission-title">
        <div className="container-jfi">
          <div id="mission-title">
            <SectionHeading eyebrow="Mission" title="Our Mission" />
          </div>
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {missionItems.map((item, index) => (
              <li key={item.title} className="card card-hover relative p-6">
                <span
                  className="absolute right-5 top-4 font-serif text-4xl font-bold text-gold/40"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-gold">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-serif text-xl font-bold">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/85">{item.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <Link href="/our-work-and-initiatives" className="btn-navy">
              See Our Work and Initiatives <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
