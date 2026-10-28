
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import HomeGallery from "@/components/HomeGallery";
import SectionHeading from "@/components/SectionHeading";
import TeamCard from "@/components/TeamCard";
import ContactDetails from "@/components/ContactDetails";
import { teamMembers } from "@/data/teamMembers";
import {
  advocacyAreas,
  advocacySummaries,
  initiativeSummaries,
  initiatives,
  introduction,
  missionItems,
  supportHeading,
  values,
  visionParagraphs,
} from "@/data/content";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Photos / videos added by the admin (hidden until something is uploaded) */}
      <HomeGallery />

      {/* Introduction */}
      <section className="section-y bg-white" aria-labelledby="intro-title">
        <div className="container-jfi grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Who We Are</p>
            <h2 id="intro-title" className="font-serif text-3xl font-bold sm:text-4xl">
              Justice is a fundamental right of every citizen
            </h2>
            <div className="mt-6 h-1 w-16 rounded bg-gold" aria-hidden="true" />
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-ink/90 lg:col-span-7">
            {introduction.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <Link href="/about-us" className="btn-navy mt-2">
              Read More About Us <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Vision and mission */}
      <section className="section-y bg-mist" aria-labelledby="vm-title">
        <div className="container-jfi">
          <SectionHeading eyebrow="Vision and Mission" title="Our Vision and Mission" />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="card relative overflow-hidden bg-navy p-8 text-white">
              <h3 id="vm-title" className="font-serif text-2xl font-bold !text-gold-light">
                Vision
              </h3>
              <p className="mt-4 leading-relaxed text-white/90">{visionParagraphs[0]}</p>
            </div>
            <div className="card p-8">
              <h3 className="font-serif text-2xl font-bold">Mission</h3>
              <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {missionItems.map((item) => (
                  <li key={item.title} className="flex items-start gap-2 text-[15px] font-medium text-ink">
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" aria-hidden="true" />
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link href="/vision-and-mission" className="btn-outline">
              Explore Vision and Mission <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Work and initiatives */}
      <section className="section-y bg-white" aria-labelledby="work-title">
        <div className="container-jfi">
          <SectionHeading eyebrow="What We Do" title="Our Work and Initiatives" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {initiatives.map((item) => (
              <article key={item.title} className="card card-hover p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-gold">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-serif text-xl font-bold">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{initiativeSummaries[item.title]}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/our-work-and-initiatives" className="btn-navy">
              View Our Work and Initiatives <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Key areas of advocacy */}
      <section className="section-y bg-navy text-white" aria-labelledby="adv-title">
        <div className="container-jfi">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow !text-gold-light">Advocacy</p>
            <h2 id="adv-title" className="font-serif text-3xl font-bold !text-white sm:text-4xl">
              Our Key Areas of Advocacy
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {advocacyAreas.map((area) => (
              <article key={area.title} className="rounded-xl border border-white/15 bg-white/5 p-7">
                <area.icon className="h-8 w-8 text-gold" aria-hidden="true" />
                <h3 className="mt-5 font-serif text-xl font-bold !text-white">{area.title}</h3>
                <p className="mt-3 leading-relaxed text-white/80">{advocacySummaries[area.title]}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/key-areas-of-advocacy" className="btn-gold">
              Explore Key Areas of Advocacy <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-y bg-mist" aria-labelledby="values-title">
        <div className="container-jfi">
          <SectionHeading eyebrow="Our Values" title="The principles that guide us" />
          <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
            {values.map((value) => (
              <li key={value.title} className="card flex flex-col items-center p-5 text-center">
                <value.icon className="h-7 w-7 text-brand-green" aria-hidden="true" />
                <span className="mt-3 font-serif text-base font-bold text-navy">{value.title}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 text-center">
            <Link href="/our-values" className="btn-outline">
              Read Our Values <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Executive team preview */}
      <section className="section-y bg-white" aria-labelledby="team-title">
        <div className="container-jfi">
          <SectionHeading
            eyebrow="Leadership"
            title="Our Executive Team"
            description="JFI is guided by a team of individuals committed to justice, public service, legal empowerment, and social responsibility."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.slice(0, 3).map((member) => (
              <TeamCard key={member.slug} member={member} compact />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/our-executive-team" className="btn-navy">
              Meet the Full Team <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Support call to action */}
      <section className="relative overflow-hidden bg-brand-green py-16 text-white" aria-labelledby="support-title">
        <div
          className="absolute inset-0 opacity-20"
          aria-hidden="true"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #fff 0, #fff 1px, transparent 1px, transparent 14px)",
          }}
        />
        <div className="container-jfi relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h2 id="support-title" className="font-serif text-3xl font-bold !text-white sm:text-4xl">
              {supportHeading}
            </h2>
            <p className="mt-3 text-lg text-white/90">
              Volunteer, offer legal support, or partner with JFI to make justice more accessible.
            </p>
          </div>
          <Link href="/support-us" className="btn-gold shrink-0">
            Support Us <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Contact information */}
      <section className="section-y bg-mist" aria-labelledby="contact-title">
        <div className="container-jfi grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Get in Touch</p>
            <h2 id="contact-title" className="font-serif text-3xl font-bold sm:text-4xl">
              Contact Our Office
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink/85">
              For legal assistance enquiries, public-interest concerns, volunteering, pro bono collaboration,
              media enquiries, or institutional partnerships, please contact our office.
            </p>
            <Link href="/contact-us" className="btn-navy mt-6">
              Go to Contact Us <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="card p-8">
            <ContactDetails />
          </div>
        </div>
      </section>
    </>
  );
}
