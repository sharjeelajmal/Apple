import type { Milestone } from "@/data/pages/aboutData";

interface AboutTimelineProps {
  milestones: Milestone[];
}

export default function AboutTimeline({ milestones }: AboutTimelineProps) {
  return (
    <ol className="relative mx-auto max-w-[720px] border-l border-line pl-8 md:pl-12">
      {milestones.map(({ year, title, description }) => (
        <li key={year} className="relative pb-12 last:pb-0">
          <span className="absolute -left-[41px] top-1 h-4 w-4 rounded-full border-4 border-surface-muted bg-accent md:-left-[57px]" />
          <p className="text-[14px] font-semibold text-accent">{year}</p>
          <h3 className="mt-1 text-[21px] font-semibold tracking-tight text-ink">{title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{description}</p>
        </li>
      ))}
    </ol>
  );
}
