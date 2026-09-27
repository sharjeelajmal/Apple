"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import type { ProductCardData } from "@/types/catalog";

const MAX_WISHLIST_ITEMS = 100;

type WishlistDocument = {
  userId: string;
  items: ProductCardData[];
  updatedAt: Date;
};

const wishlistsCollection = db.collection<WishlistDocument>("wishlists");

const sanitizeItem = ({ id, title, handle, price, image, hoverImage }: ProductCardData): ProductCardData => ({
  id: String(id),
  title: String(title),
  handle: String(handle),
  price: Number(price) || 0,
  image: String(image),
  ...(hoverImage && { hoverImage: String(hoverImage) }),
});

export async function getSavedWishlist(): Promise<ProductCardData[]> {
  const session = await getSession();
  if (!session) return [];

  const document = await wishlistsCollection.findOne({ userId: session.user.id });
  return document?.items ?? [];
}

export async function saveWishlist(items: ProductCardData[]) {
  const session = await getSession();
  if (!session) return;

  await wishlistsCollection.updateOne(
    { userId: session.user.id },
    { $set: { items: items.slice(0, MAX_WISHLIST_ITEMS).map(sanitizeItem), updatedAt: new Date() } },
    { upsert: true }
  );
  revalidatePath("/account", "layout");
}
