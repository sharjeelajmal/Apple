import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Scale } from "lucide-react";
import AiLoading from "@/components/ai/AiLoading";
import CollectionsHero from "@/components/pages/Collections/CollectionsHero";
import CompareColumns from "@/components/compare/CompareColumns";
import CompareInsights from "@/components/compare/CompareInsights";
import EmptyState from "@/components/shared/dashboard/EmptyState";
import { siteConfig } from "@/config/site";
import { getProductsByHandles } from "@/lib/catalog";
import { MAX_COMPARE_ITEMS } from "@/lib/compareList";

export const metadata: Metadata = {
  title: `Compare with AI | ${siteConfig.name}`,
};

const readHandles = (value: string | string[] | undefined) =>
  [...new Set((Array.isArray(value) ? value[0] : value ?? "").split(",").map((handle) => handle.trim()).filter(Boolean))].slice(
    0,
    MAX_COMPARE_ITEMS
  );

export default async function ComparePage({ searchParams }: PageProps<"/compare">) {
  const products = await getProductsByHandles(readHandles((await searchParams).items));

  return (
    <main className="min-h-screen bg-white font-sans">
      <CollectionsHero title="Compare with AI" />
      <section className="mx-auto w-[95%] max-w-[1100px] px-4 py-10 md:py-16">
        {products.length < 2 ? (
          <EmptyState
            icon={Scale}
            title="Pick at least two products to compare."
            description="Tap the compare icon on any product card, then press “Compare now”."
            actionLabel="Browse products"
            actionHref="/collections/all"
          />
        ) : (
          <div className="flex flex-col gap-10">
            <CompareColumns products={products} />
            <Suspense fallback={<AiLoading message="AI is comparing these products…" lines={5} />}>
              <CompareInsights products={products} />
            </Suspense>
            <Link href="/collections/all" className="self-center text-[15px] font-medium text-accent hover:underline">
              Compare different products
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
