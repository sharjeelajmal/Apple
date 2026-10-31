import { ThumbsDown, ThumbsUp } from "lucide-react";
import AiBadge from "@/components/ai/AiBadge";
import { summarizeReviews } from "@/lib/ai/features/summarizeReviews";
import type { Review } from "@/types/review";

const sentimentLabels = {
  positive: "Mostly positive",
  mixed: "Mixed opinions",
  negative: "Mostly critical",
};

type ReviewInsightsProps = {
  productTitle: string;
  reviews: Review[];
};

function InsightList({ title, points, positive }: { title: string; points: string[]; positive: boolean }) {
  return (
    <div>
      <p className={`mb-2 flex items-center gap-2 text-[14px] font-semibold ${positive ? "text-positive" : "text-danger"}`}>
        {positive ? <ThumbsUp size={15} /> : <ThumbsDown size={15} />}
        {title}
      </p>
      <ul className="flex flex-col gap-1.5 text-[14px] text-ink">
        {points.map((point) => (
          <li key={point} className="flex gap-2">
            <span className="text-ink-subtle">•</span>
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function ReviewInsights({ productTitle, reviews }: ReviewInsightsProps) {
  const insights = await summarizeReviews(productTitle, reviews).catch(() => null);
  if (!insights) return null;

  return (
    <section aria-label="What customers say" className="mb-8 rounded-card bg-surface-muted p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-[17px] font-semibold text-ink">What customers say</h3>
        <AiBadge label={`AI summary · ${sentimentLabels[insights.sentiment]}`} />
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-ink">{insights.overall}</p>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {insights.pros.length > 0 && <InsightList title="Customers like" points={insights.pros} positive />}
        {insights.cons.length > 0 && <InsightList title="Some mention" points={insights.cons} positive={false} />}
      </div>
    </section>
  );
}
