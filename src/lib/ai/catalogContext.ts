import "server-only";
import { getCategoryName } from "@/config/categories";
import { getStartingPrice, getStorefrontProducts, getTotalInventory } from "@/lib/catalog";
import type { CatalogProduct } from "@/types/catalog";

export const describeProduct = (product: CatalogProduct) =>
  [
    `handle: ${product.handle}`,
    `title: ${product.title}`,
    `category: ${getCategoryName(product.category)}`,
    `from: $${getStartingPrice(product)}`,
    `storage/sizes: ${product.availableStorages.join(", ") || "n/a"}`,
    `colors: ${product.availableColors.map((color) => color.name).join(", ") || "n/a"}`,
    `in stock: ${getTotalInventory(product) > 0 ? "yes" : "no"}`,
    `rating: ${product.totalReviews ? `${product.rating}/5 (${product.totalReviews})` : "none"}`,
  ].join(" | ");

export const describeProductInDetail = (product: CatalogProduct) =>
  `${describeProduct(product)}\nspecs: ${product.description}`;

export const catalogDigest = (products: CatalogProduct[]) => products.map(describeProduct).join("\n");

const SPEC_PREVIEW_LENGTH = 180;
const OVERVIEW_TTL_MS = 60 * 1000;

let overviewCache: { value: Promise<string>; expiresAt: number } | null = null;

const buildCatalogOverview = async () =>
  (await getStorefrontProducts())
    .map((product) => `${describeProduct(product)} | key specs: ${product.description.slice(0, SPEC_PREVIEW_LENGTH)}`)
    .join("\n");

export function getCatalogOverview() {
  if (!overviewCache || overviewCache.expiresAt < Date.now()) {
    overviewCache = { value: buildCatalogOverview(), expiresAt: Date.now() + OVERVIEW_TTL_MS };
  }
  return overviewCache.value;
}

export async function getInStockCatalog() {
  return (await getStorefrontProducts()).filter((product) => getTotalInventory(product) > 0);
}

export const pickKnownHandles = <T extends { handle: string }>(items: T[], products: CatalogProduct[]) => {
  const byHandle = new Map(products.map((product) => [product.handle, product]));
  const seen = new Set<string>();
  return items.flatMap((item) => {
    const product = byHandle.get(item.handle);
    if (!product || seen.has(item.handle)) return [];
    seen.add(item.handle);
    return [{ ...item, product }];
  });
};
