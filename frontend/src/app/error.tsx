"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="section-y">
      <div className="container-jfi mx-auto max-w-xl text-center">
        <h1 className="font-serif text-3xl font-bold">Something went wrong</h1>
        <p className="mt-4 text-lg text-ink/80">
          This page could not be displayed. Please try again, or return to the home page.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button type="button" onClick={() => reset()} className="btn-navy">
            Try again
          </button>
          <Link href="/" className="btn-outline">
            Go to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
