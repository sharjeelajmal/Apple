import { useEffect, useState } from "react";
import type { ProductCardData } from "@/types/catalog";

const DEBOUNCE_MS = 250;

export default function useProductSearch(query: string) {
  const [results, setResults] = useState<{ query: string; products: ProductCardData[] }>({ query: "", products: [] });
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
          setResults({ query: trimmedQuery, products: await response.json() });
        }
      } catch {}
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmedQuery]);

  return {
    products: trimmedQuery ? results.products : [],
    isSearching: Boolean(trimmedQuery) && results.query !== trimmedQuery,
  };
}
