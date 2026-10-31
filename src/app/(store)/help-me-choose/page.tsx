import type { Metadata } from "next";
import CollectionsHero from "@/components/pages/Collections/CollectionsHero";
import ProductFinder from "@/components/pages/ProductFinder/ProductFinder";
import { siteConfig } from "@/config/site";
import { getStorefrontProducts, toCardProduct } from "@/lib/catalog";

export const metadata: Metadata = {
  title: `Help Me Choose | ${siteConfig.name}`,
  description: "Answer a few quick questions and we'll find the right iPhone, iPad, Mac or Apple Watch for you.",
};

export default async function HelpMeChoosePage() {
  const catalogProducts = await getStorefrontProducts();
  const products = catalogProducts.map((product) => ({ ...toCardProduct(product), category: product.category }));

  return (
    <main className="min-h-screen bg-white font-sans">
      <CollectionsHero title="Help Me Choose" />
      <section className="px-4 py-12 md:py-20">
        <ProductFinder products={products} />
      </section>
    </main>
  );
}
