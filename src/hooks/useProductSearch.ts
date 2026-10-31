import { useEffect, useState } from "react";
import type { ProductCardData } from "@/types/catalog";

const DEBOUNCE_MS = 250;

type SearchResponse = {
  products: ProductCardData[];
  total: number;
  correctedQuery: string | null;
};

const EMPTY_RESPONSE: SearchResponse = { products: [], total: 0, correctedQuery: null };

export default function useProductSearch(query: string) {
  const [results, setResults] = useState<{ query: string; data: SearchResponse }>({ query: "", data: EMPTY_RESPONSE });
  const trimmedQuery = query.trim();

  useEffect(() => {
    if (!trimmedQuery) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(trimmedQuery)}`, {
          signal: controller.signal,
        });
        if (response.ok) {
          setResults({ query: trimmedQuery, data: await response.json() });
        }
      } catch {}
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmedQuery]);

  const data = trimmedQuery ? results.data : EMPTY_RESPONSE;
  return {
    ...data,
    isSearching: Boolean(trimmedQuery) && results.query !== trimmedQuery,
  };
}
