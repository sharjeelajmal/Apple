import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-surface-muted">
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[480px] w-[640px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      <div className="mx-auto max-w-[900px] px-4 py-16 text-center sm:px-6 md:py-24 lg:px-8">
        <p className="text-[14px] font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
        <h1 className="mt-4 text-[40px] font-semibold leading-[1.05] tracking-tight text-ink md:text-[64px]">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-5 max-w-[640px] text-[17px] leading-relaxed text-ink-muted md:text-[21px]">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
