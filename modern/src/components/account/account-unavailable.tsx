import Link from "next/link";
import { Leaf } from "lucide-react";

export function AccountUnavailable({
  title = "Accounts are taking a little rest",
}: {
  title?: string;
}) {
  return (
    <section className="container-page py-12 sm:py-16">
      <div className="mx-auto max-w-xl rounded-sm border border-line bg-surface/80 px-7 py-12 text-center sm:px-12">
        <span className="mx-auto mb-5 flex size-14 items-center justify-center rounded-sm bg-soft text-accent">
          <Leaf size={26} aria-hidden />
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          {title}
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          Sign-in and account features will be available once the site’s account
          service is connected. You can still explore the collection.
        </p>
        <Link
          href="/catalog"
          className="mt-7 inline-flex rounded-sm bg-action px-6 py-3 text-sm font-medium text-white hover:bg-action-hover"
        >
          Explore the collection
        </Link>
      </div>
    </section>
  );
}
