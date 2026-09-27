import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CollectionsHero from "@/components/pages/Collections/CollectionsHero";
import CollectionsLayout from "@/components/pages/Collections/CollectionsLayout";
import CollectionsSidebar from "@/components/pages/Collections/CollectionsSidebar";
import ProductGrid from "@/components/pages/Collections/ProductGrid";
import { ALL_PRODUCTS_SLUG, getCategoryName, isCategorySlug } from "@/config/categories";
import { siteConfig } from "@/config/site";
import { getCategoryCounts, getStorefrontProducts, toCardProduct } from "@/lib/catalog";
import { applyCollectionFilters, parseCollectionFilters } from "@/lib/collectionFilters";

const isKnownCollection = (id: string) => id === ALL_PRODUCTS_SLUG || isCategorySlug(id);

export async function generateMetadata({ params }: PageProps<"/collections/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: `${getCategoryName(id)} | ${siteConfig.name}` };
}

export default async function CollectionPage({ params, searchParams }: PageProps<"/collections/[id]">) {
  const { id } = await params;

  if (!isKnownCollection(id)) {
    notFound();
  }

  const filters = parseCollectionFilters(await searchParams);
  const [catalogProducts, categoryCounts] = await Promise.all([
    getStorefrontProducts({ category: isCategorySlug(id) ? id : undefined }),
    getCategoryCounts(),
  ]);

  const { products, availabilityCounts, highestPrice } = applyCollectionFilters(catalogProducts.map(toCardProduct), filters);
  const title = filters.q ? `${filters.q} in ${getCategoryName(id)}` : getCategoryName(id);

  return (
    <main className="min-h-screen bg-white font-sans text-[#777]">
      <CollectionsHero title={title} />
      <CollectionsLayout
        sidebar={
          <CollectionsSidebar
            categoryCounts={categoryCounts}
            availabilityCounts={availabilityCounts}
            highestPrice={highestPrice}
          />
        }
      >
        <ProductGrid products={products} />
      </CollectionsLayout>
    </main>
  );
}
