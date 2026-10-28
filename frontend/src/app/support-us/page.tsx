import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Landmark, MessageSquare } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import DonateSection from "@/components/DonateSection";
import PageBanner from "@/components/PageBanner";
import { supportClosing, supportHeading, supportIntro, supportWays } from "@/data/content";

export const metadata: Metadata = { title: "Support Us" };

export default function SupportUsPage() {
  return (
    <>
      <PageBanner title="Support Us" eyebrow="Get Involved" gradient/>

      {/* In-page shortcuts: both sections live on this one page */}
      <nav aria-label="On this page" className="border-b border-navy/10 bg-white">
        <ul className="container-jfi flex flex-wrap items-center justify-center gap-3 py-4">
          <li>
            <a href="#support" className="btn-outline px-5 py-2">
              <HeartHandshake className="h-4 w-4" aria-hidden="true" /> Ways to Support
            </a>
          </li>
          <li>
            <a href="#send-message" className="btn-outline px-5 py-2">
              <MessageSquare className="h-4 w-4" aria-hidden="true" /> Send a Message
            </a>
          </li>
          <li>
            <a href="#donate" className="btn-outline px-5 py-2">
              <Landmark className="h-4 w-4" aria-hidden="true" /> Donate Us
            </a>
          </li>
        </ul>
      </nav>

      <section id="support" className="section-y scroll-mt-28 bg-white">
        <div className="container-jfi">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-3xl font-bold sm:text-4xl">{supportHeading}</h2>
            <div className="mx-auto mt-5 h-1 w-16 rounded bg-gold" aria-hidden="true" />
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink/90">
              {supportIntro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {supportWays.map((way) => (
              <li key={way.title} className="card card-hover p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-gold">
                  <way.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-serif text-xl font-bold">{way.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/85">{way.text}</p>
              </li>
            ))}
          </ul>

          <div className="mt-14 rounded-2xl bg-navy p-8 text-center text-white sm:p-12">
            <p className="mx-auto max-w-3xl font-serif text-2xl leading-snug sm:text-3xl">{supportClosing}</p>
            <Link href="/contact-us" className="btn-gold mt-8">
              Contact Us <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section id="send-message" className="section-y scroll-mt-28 bg-mist" aria-labelledby="message-title">
        <div className="container-jfi">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Write to Us</p>
            <h2 id="message-title" className="font-serif text-3xl font-bold sm:text-4xl">
              Send Us a Message
            </h2>
            <div className="mx-auto mt-5 h-1 w-16 rounded bg-gold" aria-hidden="true" />
            <p className="mt-5 text-lg leading-relaxed text-ink/85">
              Want to volunteer, offer legal support or partner with JFI? Write to us and our team will get back to you.
            </p>
          </div>
          <div className="card mx-auto mt-10 max-w-3xl p-6 sm:p-8">
            <ContactForm source="support-us" />
          </div>
        </div>
      </section>

      <DonateSection />
    </>
  );
}