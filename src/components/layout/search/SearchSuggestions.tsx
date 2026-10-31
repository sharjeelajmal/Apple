"use client";

import { History, Sparkles, TrendingUp } from "lucide-react";
import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  clearRecentSearches,
  parseRecentSearches,
  POPULAR_SEARCHES,
  readRecentSearchesRaw,
  subscribeToRecentSearches,
} from "@/lib/recentSearches";

interface SearchSuggestionsProps {
  onSelect: (query: string) => void;
  onNavigate: () => void;
}

export default function SearchSuggestions({ onSelect, onNavigate }: SearchSuggestionsProps) {
  const raw = useSyncExternalStore(subscribeToRecentSearches, readRecentSearchesRaw, () => "[]");
  const recentSearches = useMemo(() => parseRecentSearches(raw), [raw]);

  return (
    <div className="grid gap-10 md:grid-cols-2">
      {recentSearches.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Recent searches</h3>
            <button type="button" onClick={clearRecentSearches} className="text-[13px] text-[#0071e3] hover:underline">
              Clear
            </button>
          </div>
          <ul className="flex flex-col gap-3">
            {recentSearches.map((search) => (
              <li key={search}>
                <button
                  type="button"
                  onClick={() => onSelect(search)}
                  className="flex items-center gap-3 text-[18px] text-gray-600 transition-colors hover:text-[#0071e3]"
                >
                  <History size={18} className="text-gray-400" />
                  {search}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Popular right now</h3>
        <ul className="flex flex-col gap-3">
          {POPULAR_SEARCHES.map((search) => (
            <li key={search}>
              <button
                type="button"
                onClick={() => onSelect(search)}
                className="flex items-center gap-3 text-[18px] text-gray-600 transition-colors hover:text-[#0071e3]"
              >
                <TrendingUp size={18} className="text-gray-400" />
                {search}
              </button>
            </li>
          ))}
        </ul>
        <Link
          href="/help-me-choose"
          onClick={onNavigate}
          className="mt-8 flex items-center gap-2 text-[16px] font-medium text-[#0071e3] hover:underline"
        >
          <Sparkles size={18} />
          Not sure what to buy? Help me choose
        </Link>
      </div>
    </div>
  );
}
