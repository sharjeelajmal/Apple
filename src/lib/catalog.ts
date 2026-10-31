import "server-only";
import { ObjectId, type Filter } from "mongodb";
import { connection } from "next/server";
import type { CategorySlug } from "@/config/categories";
import type { CatalogProduct, FullProduct, ProductCardData, ProductInput } from "@/types/catalog";
import { db } from "./mongodb";

export type ProductDocument = ProductInput & {
  _id?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type Availability = "in-stock" | "out-of-stock";

export const productsCollection = db.collection<ProductDocument>("products");

export const toCatalogProduct = ({ _id, createdAt, updatedAt, ...product }: ProductDocument): CatalogProduct => ({
  ...product,
  id: String(_id),
  createdAt: createdAt.toISOString(),
  updatedAt: updatedAt.toISOString(),
});

export const getTotalInventory = (product: Pick<ProductInput, "variants">) =>
  product.variants.reduce((total, variant) => total + variant.inventory, 0);

export const getStartingPrice = (product: Pick<ProductInput, "variants" | "basePrice">) =>
  product.variants.length ? Math.min(...product.variants.map((variant) => variant.price)) : product.basePrice;

export const toFullProduct = (product: CatalogProduct): FullProduct => ({ ...product, thumbnails: product.images });

export const toCardProduct = (product: CatalogProduct): ProductCardData => ({
  id: product.id,
  title: product.title,
  handle: product.handle,
  price: getStartingPrice(product),
  image: product.images[0] ?? "",
  hoverImage: product.images[1],
  isSoldOut: getTotalInventory(product) === 0,
  colors: product.availableColors.map((color) => color.hex),
});

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function getStorefrontProducts({ category }: { category?: CategorySlug } = {}) {
  await connection();
  const filter: Filter<ProductDocument> = { status: "active", ...(category && { category }) };
  const documents = await productsCollection.find(filter).sort({ createdAt: -1 }).toArray();
  return documents.map(toCatalogProduct);
}

export async function getProductByHandle(handle: string) {
  await connection();
  const document = await productsCollection.findOne({ handle, status: "active" });
  return document ? toCatalogProduct(document) : null;
}

export async function getProductsByHandles(handles: string[]) {
  if (!handles.length) return [];
  await connection();
  const documents = await productsCollection.find({ handle: { $in: handles }, status: "active" }).toArray();
  const byHandle = new Map(documents.map((document) => [document.handle, toCatalogProduct(document)]));
  return handles.flatMap((handle) => byHandle.get(handle) ?? []);
}

export async function getCategoryCounts() {
  await connection();
  const results = await productsCollection
    .aggregate<{ _id: CategorySlug; count: number }>([
      { $match: { status: "active" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ])
    .toArray();
  return Object.fromEntries(results.map(({ _id, count }) => [_id, count])) as Partial<Record<CategorySlug, number>>;
}

export async function getAdminProducts({ search, category }: { search?: string; category?: CategorySlug }) {
  const filter: Filter<ProductDocument> = {
    ...(category && { category }),
    ...(search && { title: { $regex: escapeRegex(search), $options: "i" } }),
  };
  const documents = await productsCollection.find(filter).sort({ updatedAt: -1 }).toArray();
  return documents.map(toCatalogProduct);
}

export async function getProductById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const document = await productsCollection.findOne({ _id: new ObjectId(id) });
  return document ? toCatalogProduct(document) : null;
}
