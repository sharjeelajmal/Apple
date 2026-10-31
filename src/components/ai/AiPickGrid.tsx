import { Sparkles } from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";
import type { ProductCardData } from "@/types/catalog";

export type AiPickItem = {
  product: ProductCardData;
  reason: string;
};

type AiPickGridProps = {
  picks: AiPickItem[];
  highlightFirst?: boolean;
};

export default function AiPickGrid({ picks, highlightFirst = false }: AiPickGridProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
      {picks.map(({ product, reason }, index) => (
        <div key={product.id} className="flex flex-col">
          {highlightFirst && (
            <p className={`mb-2 text-[12px] font-semibold uppercase tracking-wider ${index === 0 ? "text-accent" : "text-ink-subtle"}`}>
              {index === 0 ? "Top pick" : "Also great"}
            </p>
          )}
          <ProductCard product={product} />
          <p className="-mt-7 flex gap-2 rounded-field bg-surface-muted p-3 text-[14px] leading-snug text-ink">
            <Sparkles size={16} className="mt-0.5 shrink-0 text-accent" />
            {reason}
          </p>
        </div>
      ))}
    </div>
  );
}
