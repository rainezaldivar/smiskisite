export default function Loading() {
  return (
    <div
      className="container-page py-16"
      role="status"
      aria-label="Loading page"
    >
      <div className="h-5 w-24 animate-pulse rounded bg-sage" />
      <div className="mt-5 h-14 w-2/3 animate-pulse rounded-2xl bg-sage" />
      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-72 animate-pulse rounded-3xl bg-sage" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
