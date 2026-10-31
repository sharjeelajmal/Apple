import { Trophy } from "lucide-react";
import Link from "next/link";
import AiBadge from "@/components/ai/AiBadge";
import { toAiErrorMessage } from "@/lib/ai/client";
import { compareProducts, type ProductComparison } from "@/lib/ai/features/compareProducts";
import type { CatalogProduct } from "@/types/catalog";

export default async function CompareInsights({ products }: { products: CatalogProduct[] }) {
  let comparison: ProductComparison;
  try {
    comparison = await compareProducts(products);
  } catch (error) {
    return <p className="rounded-card bg-danger-soft p-5 text-[15px] text-danger">{toAiErrorMessage(error)}</p>;
  }

  const titleByHandle = new Map(products.map((product) => [product.handle, product.title]));
  const gridColumns = { gridTemplateColumns: `minmax(120px, 1fr) repeat(${products.length}, minmax(140px, 1.4fr))` };

  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-card bg-surface-muted p-6 md:p-8">
        <AiBadge label="AI verdict" />
        <p className="mt-4 text-[19px] leading-relaxed text-ink md:text-[21px]">{comparison.summary}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {comparison.picks.map((pick) => (
            <div key={pick.need} className="rounded-field bg-surface p-4 shadow-subtle">
              <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-accent">
                <Trophy size={15} />
                {pick.need}
              </p>
              <Link href={`/products/${pick.handle}`} className="mt-1 block text-[17px] font-semibold text-ink hover:text-accent">
                {titleByHandle.get(pick.handle)}
              </Link>
              <p className="mt-1 text-[14px] text-ink-muted">{pick.reason}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Side-by-side comparison" className="overflow-x-auto">
        <div className="min-w-[560px]">
          {comparison.rows.map((row) => (
            <div key={row.feature} className="grid gap-4 border-b border-line-light py-4 text-[15px]" style={gridColumns}>
              <span className="font-semibold text-ink">{row.feature}</span>
              {row.values.map((value, index) => (
                <span key={index} className="text-ink-muted">
                  {value}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
