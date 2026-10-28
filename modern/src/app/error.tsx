"use client";
import Link from "next/link";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="container-page py-24 text-center">
      <p className="eyebrow">A small hiccup</p>
      <h1 className="page-title mt-4">Let’s try that again.</h1>
      <p className="muted mt-5">
        We couldn’t load this page right now. Please retry in a moment.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button className="button-primary" onClick={reset}>
          Try again
        </button>
        <Link href="/" className="button-secondary">
          Back home
        </Link>
      </div>
    </section>
  );
}
