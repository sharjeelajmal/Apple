import "server-only";
import type { ProductCardData } from "@/types/catalog";
import { db } from "./mongodb";

type WishlistDocument = {
  userId: string;
  items: ProductCardData[];
  updatedAt: Date;
};

export const wishlistsCollection = db.collection<WishlistDocument>("wishlists");

export async function getWishlistForUser(userId: string) {
  const document = await wishlistsCollection.findOne({ userId });
  return document?.items ?? [];
}
