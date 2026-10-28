import Link from "next/link";
import { Leaf } from "lucide-react";

export function AccountUnavailable({
  title = "Accounts are taking a little rest",
}: {
  title?: string;
}) {
  return (
    <section className="mx-auto my-16 max-w-xl rounded-[2rem] border border-[#dfe5d2] bg-white/80 px-7 py-12 text-center sm:px-12">
      <span className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-[#edf3df] text-[#58723d]">
        <Leaf size={26} aria-hidden />
      </span>
      <h1 className="text-3xl font-semibold tracking-tight text-[#293329]">
        {title}
      </h1>
      <p className="mt-4 text-sm leading-7 text-[#737d6b]">
        Sign-in and account features will be available once the site’s account
        service is connected. You can still explore the collection.
      </p>
      <Link
        href="/catalog"
        className="mt-7 inline-flex rounded-full bg-[#344d31] px-6 py-3 text-sm font-medium text-white hover:bg-[#243c22]"
      >
        Explore the collection
      </Link>
    </section>
  );
}
