import type { ReviewSummary } from "@/types/review";
import StarRating from "./StarRating";

const STAR_LEVELS = [5, 4, 3, 2, 1] as const;

export default function ReviewSummaryPanel({ summary }: { summary: ReviewSummary }) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
      <div className="text-center sm:text-left">
        <p className="text-[56px] font-semibold leading-none tracking-tight text-ink">{summary.average.toFixed(1)}</p>
        <div className="mt-3 flex justify-center sm:justify-start">
          <StarRating rating={summary.average} size={18} />
        </div>
        <p className="mt-2 text-[14px] text-ink-muted">
          Based on {summary.total} {summary.total === 1 ? "review" : "reviews"}
        </p>
      </div>

      <ul className="flex flex-1 flex-col gap-2">
        {STAR_LEVELS.map((level) => {
          const count = summary.distribution[level];
          const percent = summary.total ? (count / summary.total) * 100 : 0;
          return (
            <li key={level} className="flex items-center gap-3 text-[13px] text-ink-muted">
              <span className="w-12 shrink-0">{level} star</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-line-light">
                <span className="block h-full rounded-full bg-[#f5c518]" style={{ width: `${percent}%` }} />
              </span>
              <span className="w-8 shrink-0 text-right">{count}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
