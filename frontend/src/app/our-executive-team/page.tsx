import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import TeamCard from "@/components/TeamCard";
import { teamMembers } from "@/data/teamMembers";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { wings } from "@/data/wings";



export const metadata: Metadata = { title: "Our Executive Team" };

export default function ExecutiveTeamPage() {
  return (
    <>
      <PageBanner
        title="Our Executive Team"
        eyebrow="Leadership"
        subtitle="JFI is guided by a team of individuals committed to justice, public service, legal empowerment, and social responsibility."
        gradient     
     />
      <section className="section-y bg-mist">
        <div className="container-jfi">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <li key={member.slug}>
                <TeamCard member={member} />
              </li>
            ))}
          </ul>
        </div>
      </section>

            {/* Wings */}
      <section className="section-y bg-white" aria-labelledby="wings-title">
        <div className="container-jfi">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Our Wings</p>
            <h2 id="wings-title" className="font-serif text-3xl font-bold sm:text-4xl">Explore Our Wings</h2>
            <p className="mt-4 text-lg text-ink/90">Select a wing to view its team separately.</p>
          </div>
          <ul className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            {[wings.mens, wings.womens].map((wing) => (
              <li key={wing.key}>
                <Link href={wing.href} className="card card-hover group flex h-full flex-col items-center p-8 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-gold">
                    <Users className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-serif text-2xl font-bold">{wing.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink/80">{wing.cardText}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-semibold text-brand-green">
                    View {wing.title} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
