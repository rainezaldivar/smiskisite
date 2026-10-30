import type { ReactNode } from "react";
import Image from "next/image";

export function AuthShell({
  title,
  description,
  children,
  split = false,
}: {
  title: string;
  description: string;
  children: ReactNode;
  split?: boolean;
}) {
  const content = (
    <>
      <h1
        className={
          split
            ? "text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-tight tracking-tight text-ink"
            : "text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        }
      >
        {title}
      </h1>
      <p
        className={
          split
            ? "mb-5 mt-2 text-xs leading-5 text-muted sm:mb-4 sm:text-sm"
            : "mb-8 mt-3 text-sm leading-6 text-muted"
        }
      >
        {description}
      </p>
      {children}
    </>
  );

  if (split) {
    return (
      <div className="auth-split grid sm:grid-cols-[55.5%_44.5%]">
        <div
          className="relative min-h-40 overflow-hidden sm:min-h-full"
          aria-hidden="true"
        >
          <Image
            src="/uploads/authbg.jpg"
            alt=""
            fill
            sizes="(min-width: 640px) 55.5vw, 100vw"
            loading="eager"
            className="-scale-x-100 object-cover object-right"
          />
        </div>
        <section className="auth-panel flex items-start px-6 py-8 sm:items-center sm:px-8 sm:py-6 sm:pb-3 lg:px-[48px]">
          <div className="mx-auto w-full max-w-[436px]">
            {content}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="container-page mx-auto max-w-2xl py-12 lg:py-20">
      <section className="rounded-sm border border-line bg-surface/85 p-7 sm:p-10">
        {content}
      </section>
    </div>
  );
}
