import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import { values } from "@/data/content";

export const metadata: Metadata = { title: "Our Values" };

export default function OurValuesPage() {
  return (
    <>
      <PageBanner
        title="Our Values"
        eyebrow="Principles"
        subtitle="The commitments that shape everything JFI does."
        gradient
      />
      <section className="section-y bg-mist">
        <div className="container-jfi">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <li key={value.title} className="card card-hover flex flex-col p-7">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold bg-navy text-gold">
                  <value.icon className="h-7 w-7" aria-hidden="true" />
                </span>
                <h2 className="mt-5 font-serif text-2xl font-bold">{value.title}</h2>
                <div className="mt-3 h-1 w-12 rounded bg-brand-green" aria-hidden="true" />
                <p className="mt-4 text-[17px] leading-relaxed text-ink/90">{value.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
