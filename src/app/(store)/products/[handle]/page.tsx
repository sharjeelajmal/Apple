import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/pages/Product/Breadcrumb";
import ProductGallery from "@/components/pages/Product/ProductGallery";
import ProductInfo from "@/components/pages/Product/ProductInfo";
import ProductCard from "@/components/shared/ProductCard";
import { getCategoryName } from "@/config/categories";
import { siteConfig } from "@/config/site";
import { getProductByHandle, getStorefrontProducts, toCardProduct, toFullProduct } from "@/lib/catalog";

const RELATED_PRODUCTS_LIMIT = 4;

export async function generateMetadata({ params }: PageProps<"/products/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  return product
    ? {
        title: `${product.title} | ${siteConfig.name}`,
        description: product.description.slice(0, 160),
        openGraph: { images: product.images.slice(0, 1) },
      }
    : {};
}

export default async function ProductPage({ params }: PageProps<"/products/[handle]">) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const relatedProducts = (await getStorefrontProducts({ category: product.category }))
    .filter((item) => item.id !== product.id)
    .slice(0, RELATED_PRODUCTS_LIMIT);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: getCategoryName(product.category), href: `/collections/${product.category}` },
    { label: product.title },
  ];

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-[70px] pb-20">
        <Breadcrumb items={breadcrumbs} />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            <div className="h-full">
              <div className="sticky top-[120px]">
                <ProductGallery images={product.images} thumbnails={product.images} title={product.title} />
              </div>
            </div>

            <div className="h-full pt-4">
              <ProductInfo product={toFullProduct(product)} />
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-32">
            <div className="text-center mb-12">
              <h2 className="text-[32px] md:text-[40px] font-semibold text-[#1d1d1f] tracking-tight">
                You might also like
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={toCardProduct(relatedProduct)} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
