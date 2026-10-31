import type { Metadata } from "next";
import CollectionsHero from "@/components/pages/Collections/CollectionsHero";
import ProductGrid from "@/components/pages/Collections/ProductGrid";
import SearchEmptyState from "@/components/pages/Search/SearchEmptyState";
import PhotoSearchPanel from "@/components/pages/Search/PhotoSearchPanel";
import SearchForm from "@/components/pages/Search/SearchForm";
import { assistantConfig } from "@/config/env";
import SearchSummary from "@/components/pages/Search/SearchSummary";
import { siteConfig } from "@/config/site";
import { toCardProduct } from "@/lib/catalog";
import { normalizeQuery, searchCatalog } from "@/lib/search";

const readQuery = (value: string | string[] | undefined) => normalizeQuery(Array.isArray(value) ? value[0] ?? "" : value ?? "");

export async function generateMetadata({ searchParams }: PageProps<"/search">): Promise<Metadata> {
  const query = readQuery((await searchParams).q);
  return { title: `${query ? `${query} - Search` : "Search"} | ${siteConfig.name}` };
}

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const query = readQuery((await searchParams).q);
  const { products, correctedQuery } = query ? await searchCatalog(query) : { products: [], correctedQuery: null };

  return (
    <main className="min-h-screen bg-white font-sans">
      <CollectionsHero title="Search" />
      <section className="mx-auto w-[95%] max-w-[1200px] px-4 py-10">
        <SearchForm key={query} defaultValue={query} />
        {assistantConfig.isEnabled && <PhotoSearchPanel />}
        <div className="mt-10">
          {products.length > 0 ? (
            <>
              <SearchSummary query={query} total={products.length} correctedQuery={correctedQuery} />
              <ProductGrid products={products.map(toCardProduct)} />
            </>
          ) : (
            <SearchEmptyState query={query} />
          )}
        </div>
      </section>
    </main>
  );
}
