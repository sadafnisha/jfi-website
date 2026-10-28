import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import { commitmentParagraphs, commitmentRefrain, commitmentSignoff } from "@/data/content";

export const metadata: Metadata = { title: "Our Commitment" };

export default function OurCommitmentPage() {
  return (
    <>
      <PageBanner title="Our Commitment" eyebrow="Justice Front of India" gradient/>
      <section className="section-y bg-white">
        <div className="container-jfi">
          <div className="mx-auto max-w-3xl space-y-6 text-center text-xl leading-relaxed text-ink/90">
            {commitmentParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy py-20 text-center text-white" aria-label="Our pledge in brief">
        <div
          className="absolute inset-0 opacity-30"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgba(232,162,58,0.5), transparent 40%), radial-gradient(circle at 90% 90%, rgba(39,138,67,0.55), transparent 40%)",
          }}
        />
        <div className="container-jfi relative">
          <div className="mx-auto mb-8 h-1 w-20 rounded bg-gold" aria-hidden="true" />
          <p className="mx-auto max-w-4xl font-serif text-3xl font-bold leading-snug !text-white sm:text-5xl">
            {commitmentRefrain}
          </p>
          <div className="mx-auto mt-8 h-1 w-20 rounded bg-gold" aria-hidden="true" />
        </div>
      </section>

      <section className="section-y bg-mist">
        <div className="container-jfi text-center">
          <p className="mx-auto max-w-3xl font-serif text-2xl leading-snug text-navy sm:text-3xl">
            {commitmentSignoff}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/support-us" className="btn-navy">
              Support Us <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/contact-us" className="btn-outline">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
