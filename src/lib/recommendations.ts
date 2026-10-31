import "server-only";
import { ObjectId } from "mongodb";
import { complementaryCategories, FREQUENTLY_BOUGHT_LIMIT } from "@/config/recommendations";
import type { BundleProduct, CatalogProduct } from "@/types/catalog";
import { getStartingPrice, getStorefrontProducts, getTotalInventory, productsCollection, toCardProduct, toCatalogProduct } from "./catalog";
import { ordersCollection } from "./orders";
import { variantLabel } from "./variants";

const isInStock = (product: CatalogProduct) => getTotalInventory(product) > 0;

export const toBundleProduct = (product: CatalogProduct): BundleProduct => {
  const card = toCardProduct(product);
  const variant = product.variants
    .filter((item) => item.inventory > 0)
    .sort((a, b) => a.price - b.price)[0];

  if (!variant) return { ...card, variantLabel: null, variant: null };

  return {
    ...card,
    price: variant.price,
    image: variant.image || card.image,
    variantLabel: variantLabel(variant),
    variant: { storage: variant.storage, colorHex: variant.color.hex, colorName: variant.color.name },
  };
};

async function getCoPurchasedProducts(product: CatalogProduct) {
  const results = await ordersCollection
    .aggregate<{ _id: string }>([
      { $match: { status: { $ne: "cancelled" }, "items.productId": product.id } },
      { $unwind: "$items" },
      { $match: { "items.productId": { $ne: product.id } } },
      { $group: { _id: "$items.productId", orders: { $addToSet: "$_id" } } },
      { $project: { orderCount: { $size: "$orders" } } },
      { $sort: { orderCount: -1 } },
      { $limit: 10 },
    ])
    .toArray();

  const ids = results.map((result) => result._id).filter((id) => ObjectId.isValid(id));
  if (!ids.length) return [];

  const documents = await productsCollection
    .find({ _id: { $in: ids.map((id) => new ObjectId(id)) }, status: "active" })
    .toArray();
  const byId = new Map(documents.map((document) => [String(document._id), toCatalogProduct(document)]));

  return ids.flatMap((id) => byId.get(id) ?? []).filter(isInStock);
}

async function getComplementaryProducts(product: CatalogProduct) {
  const groups = await Promise.all(
    complementaryCategories[product.category].map((category) => getStorefrontProducts({ category }))
  );
  const price = getStartingPrice(product);

  return groups.flatMap((products) => {
    const available = products.filter(isInStock);
    const cheapest = [...available].sort((a, b) => getStartingPrice(a) - getStartingPrice(b))[0];
    return available.find((item) => getStartingPrice(item) <= price) ?? cheapest ?? [];
  });
}

export async function getFrequentlyBoughtTogether(product: CatalogProduct) {
  const [coPurchased, complementary] = await Promise.all([
    getCoPurchasedProducts(product),
    getComplementaryProducts(product),
  ]);

  const seen = new Set([product.id]);
  return [...coPurchased, ...complementary]
    .filter((item) => !seen.has(item.id) && seen.add(item.id))
    .slice(0, FREQUENTLY_BOUGHT_LIMIT)
    .map(toBundleProduct);
}
