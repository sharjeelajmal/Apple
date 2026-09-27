import type { AboutStat } from "@/data/pages/aboutData";

interface AboutStatsProps {
  stats: AboutStat[];
}

export default function AboutStats({ stats }: AboutStatsProps) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line-light bg-line-light shadow-soft md:grid-cols-4">
      {stats.map(({ value, label }) => (
        <div key={label} className="bg-surface px-6 py-8 text-center md:py-10">
          <dt className="sr-only">{label}</dt>
          <dd>
            <span className="block text-[32px] font-semibold tracking-tight text-ink md:text-[40px]">{value}</span>
            <span className="mt-1 block text-[14px] text-ink-muted">{label}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
