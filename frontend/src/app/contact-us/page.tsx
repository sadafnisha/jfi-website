import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import ContactForm from "@/components/ContactForm";
import ContactDetails from "@/components/ContactDetails";
import SocialLinks from "@/components/SocialLinks";
import { contactIntro } from "@/data/content";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactUsPage() {
  return (
    <>
      <PageBanner title="Contact Us" eyebrow="Get in Touch" subtitle={contactIntro} gradient/>
      <section className="section-y bg-mist">
        <div className="container-jfi grid gap-10 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-5">
            <div className="card p-8">
              <h2 className="mb-6 font-serif text-2xl font-bold">Our Office</h2>
              <ContactDetails />
            </div>
            <div className="card p-8">
              <h2 className="font-serif text-2xl font-bold">Follow JFI</h2>
              <p className="mb-4 mt-2 text-sm text-ink/70">
                Official social media links will appear here once they are provided.
              </p>
              <SocialLinks tone="dark" />
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="card p-8 sm:p-10">
              <h2 className="font-serif text-2xl font-bold">Send Us a Message</h2>
              <p className="mb-6 mt-2 text-ink/75">Please share a few details and we will review your enquiry.</p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
