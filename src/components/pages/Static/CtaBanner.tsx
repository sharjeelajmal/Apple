import { Button } from "@/components/ui/Button";

interface CtaBannerProps {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}

export default function CtaBanner({ title, description, actionLabel, actionHref }: CtaBannerProps) {
  return (
    <section className="mx-auto max-w-[1200px] px-4 pb-20 sm:px-6 md:pb-28 lg:px-8">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-ink px-6 py-14 text-center md:px-16 md:py-20">
        <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 -z-10 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl" />
        <h2 className="text-[32px] font-semibold tracking-tight text-white md:text-[44px]">{title}</h2>
        <p className="mx-auto mt-4 max-w-[520px] text-[17px] text-white/70">{description}</p>
        <Button href={actionHref} className="mt-8 font-medium">
          {actionLabel}
        </Button>
      </div>
    </section>
  );
}
