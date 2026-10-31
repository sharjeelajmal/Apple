"use client";

import { useEffect } from "react";
import ProductCard from "@/components/shared/ProductCard";
import useRecentlyViewed from "@/hooks/useRecentlyViewed";
import { addRecentlyViewed } from "@/lib/recentlyViewed";
import type { ProductCardData } from "@/types/catalog";

const VISIBLE_ITEMS = 4;

interface RecentlyViewedProps {
  currentProduct?: ProductCardData;
  title?: string;
}

export default function RecentlyViewed({ currentProduct, title = "Recently viewed" }: RecentlyViewedProps) {
  const items = useRecentlyViewed(currentProduct?.id).slice(0, VISIBLE_ITEMS);

  useEffect(() => {
    if (currentProduct) addRecentlyViewed(currentProduct);
  }, [currentProduct]);

  if (!items.length) return null;

  return (
    <section aria-label={title} className="mx-auto mt-16 max-w-[1200px] px-4 sm:px-6 md:mt-24 lg:px-8">
      <h2 className="mb-10 text-center text-[28px] font-semibold tracking-tight text-ink md:text-[36px]">{title}</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
