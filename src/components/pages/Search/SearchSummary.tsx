import Link from "next/link";

type SearchSummaryProps = {
  query: string;
  total: number;
  correctedQuery: string | null;
};

export default function SearchSummary({ query, total, correctedQuery }: SearchSummaryProps) {
  return (
    <div className="mb-6 text-[15px] text-ink-muted">
      {correctedQuery ? (
        <p>
          No exact matches for <span className="font-semibold text-ink">&ldquo;{query}&rdquo;</span>. Showing{" "}
          {total} {total === 1 ? "result" : "results"} for{" "}
          <Link href={`/search?q=${encodeURIComponent(correctedQuery)}`} className="font-semibold text-accent hover:underline">
            {correctedQuery}
          </Link>
          .
        </p>
      ) : (
        <p>
          {total} {total === 1 ? "result" : "results"} for <span className="font-semibold text-ink">&ldquo;{query}&rdquo;</span>
        </p>
      )}
    </div>
  );
}
