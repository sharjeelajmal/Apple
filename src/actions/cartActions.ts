"use server";

import { ObjectId } from "mongodb";
import type { CartItem } from "@/context/CartContext";
import { productsCollection, toCatalogProduct } from "@/lib/catalog";
import type { CatalogProduct } from "@/types/catalog";

export type CartSyncResult = {
  items: CartItem[];
  notices: string[];
};

const findVariant = (product: CatalogProduct, item: CartItem) =>
  item.variant
    ? product.variants.find(
        (variant) => variant.storage === (item.variant?.storage ?? "") && variant.color.hex === (item.variant?.colorHex ?? "")
      )
    : [...product.variants].filter((variant) => variant.inventory > 0).sort((a, b) => a.price - b.price)[0];

export async function syncCartItems(items: CartItem[]): Promise<CartSyncResult> {
  if (!Array.isArray(items) || !items.length) return { items: [], notices: [] };

  const ids = [...new Set(items.map((item) => item.productId).filter((id) => ObjectId.isValid(id)))];
  const documents = await productsCollection
    .find({ _id: { $in: ids.map((id) => new ObjectId(id)) }, status: "active" })
    .toArray();
  const products = new Map(documents.map((document) => [String(document._id), toCatalogProduct(document)]));

  const notices: string[] = [];
  const syncedItems = items.flatMap((item): CartItem[] => {
    const product = products.get(item.productId);
    const variant = product && findVariant(product, item);

    if (!product || !variant || variant.inventory === 0) {
      notices.push(`"${item.title}" is no longer available and was removed from your bag.`);
      return [];
    }

    const quantity = Math.min(item.quantity, variant.inventory);
    if (quantity < item.quantity) {
      notices.push(`Only ${variant.inventory} of "${product.title}" left, so we updated the quantity.`);
    }

    return [
      {
        ...item,
        title: product.title,
        handle: product.handle,
        price: variant.price,
        image: variant.image || product.images[0] || item.image,
        quantity,
      },
    ];
  });

  return { items: syncedItems, notices };
}
