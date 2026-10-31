import Link from "next/link";
import { POPULAR_SEARCHES } from "@/lib/recentSearches";

export default function SearchEmptyState({ query }: { query: string }) {
  return (
    <div className="py-16 text-center">
      <p className="text-[21px] font-semibold text-ink">
        {query ? <>No results for &ldquo;{query}&rdquo;</> : "What are you looking for?"}
      </p>
      <p className="mt-2 text-[15px] text-ink-muted">
        {query ? "Check the spelling or try a model name instead." : "Search by model, storage or color."}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {POPULAR_SEARCHES.map((search) => (
          <Link
            key={search}
            href={`/search?q=${encodeURIComponent(search)}`}
            className="rounded-full border border-line px-4 py-2 text-[14px] text-ink transition-colors hover:border-accent hover:text-accent"
          >
            {search}
          </Link>
        ))}
      </div>
    </div>
  );
}
