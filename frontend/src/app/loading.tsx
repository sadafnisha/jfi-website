export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-navy/15 border-t-gold" aria-hidden="true" />
      <span className="sr-only">Loading page…</span>
    </div>
  );
}
