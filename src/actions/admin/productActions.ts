"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { isArModelUrl } from "@/config/arModels";
import { isCategorySlug } from "@/config/categories";
import { isAllowedImageUrl } from "@/config/imageHosts";
import { starterCatalog } from "@/data/seed/starterCatalog";
import { assertAdmin } from "@/lib/adminAuth";
import { processProductAlerts } from "@/lib/alerts";
import { productsCollection } from "@/lib/catalog";
import { slugify } from "@/lib/slugify";
import type { ProductInput, ProductVariant } from "@/types/catalog";

type ActionResult = { error: string; id?: string };

const toNumber = (value: unknown, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
};

const toText = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const sanitizeVariant = (variant: ProductVariant, index: number): ProductVariant => ({
  id: toText(variant.id) || `variant-${index + 1}`,
  storage: toText(variant.storage),
  color: { name: toText(variant.color?.name), hex: toText(variant.color?.hex) },
  price: toNumber(variant.price),
  inventory: Math.floor(toNumber(variant.inventory)),
  image: toText(variant.image),
});

const sanitizeProduct = (input: ProductInput): ProductInput => {
  const images = (input.images ?? []).map(toText).filter(Boolean);
  const basePrice = toNumber(input.basePrice);

  return {
    title: toText(input.title),
    handle: slugify(toText(input.handle) || toText(input.title)),
    category: input.category,
    status: input.status === "draft" ? "draft" : "active",
    vendor: toText(input.vendor),
    type: toText(input.type),
    basePrice,
    description: toText(input.description),
    images,
    rating: Math.min(5, toNumber(input.rating)),
    totalReviews: Math.floor(toNumber(input.totalReviews)),
    availableStorages: (input.availableStorages ?? []).map(toText).filter(Boolean),
    availableColors: (input.availableColors ?? [])
      .map((color) => ({ name: toText(color.name), hex: toText(color.hex), image: toText(color.image) || undefined }))
      .filter((color) => color.name && color.hex),
    variants: (input.variants ?? []).map(sanitizeVariant),
    arModel: toText(input.arModel),
  };
};

const validateProduct = (product: ProductInput) => {
  if (!product.title) return "Product name is required.";
  if (!product.handle) return "URL handle is required.";
  if (!isCategorySlug(product.category)) return "Please choose a category.";
  if (!product.images.length) return "Add at least one product image.";
  if (!product.variants.length) return "Add at least one variant with price and stock.";

  const imageUrls = [
    ...product.images,
    ...product.availableColors.flatMap((color) => color.image ?? []),
    ...product.variants.map((variant) => variant.image).filter(Boolean),
  ];
  if (!imageUrls.every(isAllowedImageUrl)) return "Please upload images instead of linking to other websites.";
  if (product.arModel && !isArModelUrl(product.arModel)) return "Please upload the AR model as a .usdz file.";

  return "";
};

const refreshStorefront = () => revalidatePath("/", "layout");

export async function saveProduct(input: ProductInput, productId?: string): Promise<ActionResult> {
  await assertAdmin();

  const product = sanitizeProduct(input);
  const error = validateProduct(product);
  if (error) return { error };

  const id = productId && ObjectId.isValid(productId) ? new ObjectId(productId) : undefined;
  const existing = id ? await productsCollection.findOne({ _id: id }, { projection: { rating: 1, totalReviews: 1 } }) : null;
  if (id && !existing) return { error: "This product no longer exists." };

  const duplicate = await productsCollection.findOne({ handle: product.handle, ...(id && { _id: { $ne: id } }) });
  if (duplicate) return { error: `Another product already uses the handle "${product.handle}".` };

  const now = new Date();

  if (id && existing) {
    const updated = { ...product, rating: existing.rating, totalReviews: existing.totalReviews };
    await productsCollection.updateOne({ _id: id }, { $set: { ...updated, updatedAt: now } });
    await processProductAlerts(String(id), updated);
    refreshStorefront();
    return { error: "", id: String(id) };
  }

  const { insertedId } = await productsCollection.insertOne({
    ...product,
    rating: 0,
    totalReviews: 0,
    createdAt: now,
    updatedAt: now,
  });
  refreshStorefront();
  return { error: "", id: String(insertedId) };
}

export async function deleteProduct(productId: string) {
  await assertAdmin();
  if (!ObjectId.isValid(productId)) return;

  await productsCollection.deleteOne({ _id: new ObjectId(productId) });
  refreshStorefront();
}

export async function importStarterCatalog() {
  await assertAdmin();

  const existingHandles = new Set(
    (await productsCollection.find({}, { projection: { handle: 1 } }).toArray()).map((product) => product.handle)
  );
  const now = new Date();
  const newProducts = starterCatalog
    .filter((product) => !existingHandles.has(product.handle))
    .map((product) => ({ ...product, createdAt: now, updatedAt: now }));

  if (newProducts.length) {
    await productsCollection.insertMany(newProducts);
  }

  await productsCollection.createIndex({ handle: 1 }, { unique: true });
  refreshStorefront();
  return { imported: newProducts.length };
}
