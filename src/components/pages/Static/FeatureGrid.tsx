import type { LucideIcon } from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

interface FeatureGridProps {
  features: Feature[];
}

export default function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {features.map(({ icon: Icon, title, description }) => (
        <article
          key={title}
          className="rounded-card border border-line-light bg-surface p-6 shadow-soft transition-transform duration-300 ease-smooth hover:-translate-y-1 md:p-8"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <Icon size={22} />
          </span>
          <h3 className="mt-5 text-[19px] font-semibold text-ink">{title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{description}</p>
        </article>
      ))}
    </div>
  );
}
