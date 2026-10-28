import type { Metadata } from "next";
import JoinUsForm from "@/components/JoinUsForm";
import PageBanner from "@/components/PageBanner";

export const metadata: Metadata = { title: "Join Us" };

/**
 * The Navbar and Footer come from the root layout (src/app/layout.tsx),
 * and <main> is provided there too, so this page must not add its own.
 */
export default function JoinUsPage() {
  return (
    <>
      <PageBanner
        title="Join Justice Front of India"
        eyebrow="Become a Member"
        subtitle="Join us in working towards justice for all, equality for everyone, and dignity for every citizen."
        gradient
      />
      <section className="section-y bg-mist">
        <div className="container-jfi">
          <div className="mx-auto max-w-5xl">
            <JoinUsForm />
          </div>
        </div>
      </section>
    </>
  );
}
