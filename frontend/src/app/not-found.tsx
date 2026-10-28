import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-y">
      <div className="container-jfi mx-auto max-w-xl text-center">
        <p className="font-serif text-6xl font-bold text-gold">404</p>
        <h1 className="mt-2 font-serif text-3xl font-bold">Page not found</h1>
        <p className="mt-4 text-lg text-ink/80">The page you are looking for does not exist or has moved.</p>
        <Link href="/" className="btn-navy mt-8">
          Go to Home
        </Link>
      </div>
    </section>
  );
}
