import type { ReactNode } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1fr] lg:items-center lg:gap-20 lg:py-20">
      <div className="hidden text-[#293329] lg:block">
        <span className="inline-flex items-center gap-2 rounded-sm border border-[#d8e2c7] bg-[#edf3df] px-4 py-2 text-xs font-medium text-[#58723d]">
          <Sparkles size={14} aria-hidden /> A little corner of your own
        </span>
        <h2 className="mt-6 text-5xl font-semibold leading-[1.12] tracking-tight">
          Small friends.
          <br />
          Happy discoveries.
        </h2>
        <p className="mt-5 max-w-sm text-sm leading-7 text-[#737d6b]">
          Make yourself at home. Keep your details together and find a little
          joy in the collection.
        </p>
        <div className="mt-9 flex h-56 items-end justify-center rounded-sm bg-[#e9efd9] px-8 pt-7">
          <Image
            src="/uploads/smiski5.png"
            width={220}
            height={210}
            alt="A little Smiski friend"
            className="h-full w-auto object-contain"
          />
        </div>
      </div>
      <section className="rounded-sm border border-[#dfe5d2] bg-white/85 p-7 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#829568]">
          Smiski family
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#293329] sm:text-4xl">
          {title}
        </h1>
        <p className="mb-8 mt-3 text-sm leading-6 text-[#737d6b]">
          {description}
        </p>
        {children}
      </section>
    </div>
  );
}
