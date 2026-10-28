import Link from "next/link";
import { ArrowLeft, ArrowRight, Users } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import TeamCard from "@/components/TeamCard";
import { getWingMembers, wings, type WingKey } from "@/data/wings";

/** Shared layout for the Men's Wing and Women's Wing pages. */
export default function WingTeam({ wingKey }: { wingKey: WingKey }) {
  const wing = wings[wingKey];
  const other = wings[wingKey === "mens" ? "womens" : "mens"];
  const members = getWingMembers(wingKey);

  return (
    <>
      <PageBanner title={wing.title} eyebrow="Our Executive Team" subtitle={wing.intro} />
      <section className="section-y bg-mist">
        <div className="container-jfi">
          <Link href="/our-executive-team" className="btn-outline mb-10 px-5 py-2.5">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to Our Executive Team
          </Link>

          {members.length > 0 ? (
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <li key={member.slug}>
                  <TeamCard member={member} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mx-auto flex max-w-2xl flex-col items-center rounded-xl border-2 border-dashed border-gold/60 bg-white px-6 py-10 text-center sm:px-10">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-gold">
                <Users className="h-7 w-7" aria-hidden="true" />
              </span>
              <h2 className="mt-5 font-serif text-xl font-bold">Members will be listed here</h2>
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink/80">
                The {wing.title} team will be published once JFI confirms its members.
              </p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href={other.href} className="btn-navy">
              View {other.title} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
