import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Camera, Flag, BookOpen, Quote, Video } from "lucide-react";
import ImpactGallery from "@/components/ImpactGallery";
import ImpactPlaceholder from "@/components/ImpactPlaceholder";
import PageBanner from "@/components/PageBanner";
import SectionHeading from "@/components/SectionHeading";
import StoryCard from "@/components/StoryCard";
import VideoCard from "@/components/VideoCard";
import { initiativeSummaries, initiatives } from "@/data/content";
import {
  impactAchievements,
  impactGallery,
  impactStories,
  impactTestimonials,
  impactVideos,
} from "@/data/impact";

export const metadata: Metadata = {
  title: "Our Impact",
  description:
    "Photographs, videos, stories and milestones documenting the work and activities of Justice Front of India.",
};

const jumpLinks = [
  { href: "#stories", label: "Stories" },
  { href: "#achievements", label: "Milestones" },
  { href: "#gallery", label: "Photo Gallery" },
  { href: "#videos", label: "Videos" },
  { href: "#voices", label: "Voices" },
];

/**
 * All content comes from src/data/impact.ts. While a list there is empty, its section shows a
 * "coming soon" panel; nothing is invented. The Navbar and Footer come from the root layout.
 */
export default function OurImpactPage() {
  return (
    <>
      {/* A. Banner */}
      <PageBanner
        title="Our Impact"
        eyebrow="Justice Front of India"
        subtitle="Documenting our commitment to justice, equality, human rights, and dignity for every citizen."
        gradient
      />

      {/* In-page shortcuts */}
      <nav aria-label="On this page" className="border-b border-navy/10 bg-white">
        <ul className="container-jfi flex flex-wrap items-center justify-center gap-2 py-4">
          {jumpLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="btn-outline px-4 py-2">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* B. Introduction */}
      <section className="section-y bg-white" aria-labelledby="impact-intro-title">
        <div className="container-jfi">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Our Work in Focus</p>
            <h2 id="impact-intro-title" className="font-serif text-3xl font-bold sm:text-4xl">
              A record of what we do, and the people we do it with
            </h2>
            <div className="mx-auto mt-5 h-1 w-16 rounded bg-gold" aria-hidden="true" />
            <p className="mt-6 text-lg leading-relaxed text-ink/90">
              This page documents the work and activities of Justice Front of India: our programmes, campaigns and
              outreach, and the people and communities we work alongside. Photographs, videos, stories and milestones
              are added here as they are verified by JFI.
            </p>
          </div>

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {initiatives.map((item) => (
              <li key={item.title} className="card flex flex-col p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-gold">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-serif text-lg font-bold leading-snug">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/80">{initiativeSummaries[item.title]}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 text-center">
            <Link href="/our-work-and-initiatives" className="btn-outline">
              About Our Initiatives <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* C. Featured stories */}
      <section id="stories" className="section-y scroll-mt-28 bg-mist" aria-labelledby="stories-title">
        <div className="container-jfi">
          <div id="stories-title">
            <SectionHeading eyebrow="Featured Stories" title="Stories from the Field" />
          </div>
          <div className="mt-12">
            {impactStories.length > 0 ? (
              <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {impactStories.map((story) => (
                  <li key={story.id}>
                    <StoryCard story={story} />
                  </li>
                ))}
              </ul>
            ) : (
              <ImpactPlaceholder
                icon={BookOpen}
                title="Stories coming soon"
                text="Verified stories from JFI's programmes and campaigns will be published here, each with photographs and details."
              />
            )}
          </div>
        </div>
      </section>

      {/* D. Achievements and milestones */}
      <section id="achievements" className="section-y scroll-mt-28 bg-white" aria-labelledby="achievements-title">
        <div className="container-jfi">
          <div id="achievements-title">
            <SectionHeading eyebrow="Achievements and Milestones" title="Milestones on Our Journey" />
          </div>
          <div className="mt-12">
            {impactAchievements.length > 0 ? (
              <ol className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
                {impactAchievements.map((item) => (
                  <li key={item.id} className="card card-hover relative p-6 pl-7">
                    <span className="absolute inset-y-0 left-0 w-1.5 rounded-l-xl bg-gradient-to-b from-gold to-brand-green" aria-hidden="true" />
                    {item.year && (
                      <p className="inline-flex rounded-full bg-navy px-3 py-1 text-xs font-semibold text-gold">
                        {item.year}
                      </p>
                    )}
                    <h3 className="mt-3 font-serif text-xl font-bold leading-snug">{item.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink/85">{item.description}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <ImpactPlaceholder
                icon={Flag}
                title="Milestones will be listed here"
                text="Verified achievements, completed initiatives and organisational milestones will be added as JFI confirms them."
              />
            )}
          </div>
        </div>
      </section>

      {/* E. Photo gallery */}
      <section id="gallery" className="section-y scroll-mt-28 bg-mist" aria-labelledby="gallery-title">
        <div className="container-jfi">
          <div id="gallery-title">
            <SectionHeading
              eyebrow="Photo Gallery"
              title="JFI in Action"
              description={
                impactGallery.length > 0
                  ? "Photographs from our events, programmes and activities. Select a picture to view it larger."
                  : undefined
              }
            />
          </div>
          <div className="mt-12">
            {impactGallery.length > 0 ? (
              <ImpactGallery images={impactGallery} />
            ) : (
              <ImpactPlaceholder
                icon={Camera}
                title="Photographs coming soon"
                text="Photographs from JFI's events, awareness programmes and public activities will appear here."
              />
            )}
          </div>
        </div>
      </section>

      {/* F. Video stories */}
      <section id="videos" className="section-y scroll-mt-28 bg-navy text-white" aria-labelledby="videos-title">
        <div className="container-jfi">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow !text-gold-light">Video Stories</p>
            <h2 id="videos-title" className="font-serif text-3xl font-bold !text-white sm:text-4xl">
              Our Work on Film
            </h2>
          </div>
          <div className="mt-12">
            {impactVideos.length > 0 ? (
              <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {impactVideos.map((video) => (
                  <li key={video.id}>
                    <VideoCard video={video} />
                  </li>
                ))}
              </ul>
            ) : (
              <ImpactPlaceholder
                tone="dark"
                icon={Video}
                title="Videos coming soon"
                text="Videos documenting JFI's activities and work will be added here. Playback starts only when you press play."
              />
            )}
          </div>
        </div>
      </section>

      {/* G. Stories of change / testimonials */}
      <section id="voices" className="section-y scroll-mt-28 bg-mist" aria-labelledby="voices-title">
        <div className="container-jfi">
          <div id="voices-title">
            <SectionHeading eyebrow="Stories of Change" title="In Their Own Words" />
          </div>
          <div className="mt-12">
            {impactTestimonials.length > 0 ? (
              <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {impactTestimonials.map((item) => (
                  <li key={item.id}>
                    <figure className="card flex h-full flex-col p-7">
                      <Quote className="h-8 w-8 text-gold" aria-hidden="true" />
                      <blockquote className="mt-4 flex-1 font-serif text-lg leading-relaxed text-navy">
                        {item.quote}
                      </blockquote>
                      <figcaption className="mt-5 border-t border-navy/10 pt-4">
                        <p className="font-semibold text-navy">{item.name}</p>
                        {item.context && <p className="text-sm text-ink/70">{item.context}</p>}
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            ) : (
              <ImpactPlaceholder
                icon={Quote}
                title="Stories of change will be shared here"
                text="Accounts from people and communities will be published only with their consent."
              />
            )}
          </div>
        </div>
      </section>

      {/* H. Call to action */}
      <section className="relative overflow-hidden bg-brand-green py-16 text-white" aria-labelledby="impact-cta-title">
        {/* <div
          className="absolute inset-0 opacity-20"
          aria-hidden="true"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #fff 0, #fff 1px, transparent 1px, transparent 14px)",
          }}
        /> */}
        <div className="container-jfi relative text-center">
          <h2 id="impact-cta-title" className="mx-auto max-w-3xl font-serif text-3xl font-bold !text-white sm:text-4xl">
            Be Part of the Work
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            Learn more about Justice Front of India, join the organization, or support its mission.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link href="/about-us" className="btn-outline-light">
              Learn About JFI
            </Link>
            <Link href="/join-us" className="btn-gold">
              Join Us <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/support-us" className="btn-outline-light">
              Support Our Mission
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
