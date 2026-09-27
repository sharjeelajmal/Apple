"use server";

import { randomBytes } from "node:crypto";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import type { CartItem } from "@/context/CartContext";
import type { CheckoutDetails, Order } from "@/types/order";
import type { CatalogProduct, ProductVariant } from "@/types/catalog";
import { productsCollection, toCatalogProduct } from "@/lib/catalog";
import { sanitizeCheckoutDetails } from "@/lib/checkout/sanitizeCheckout";
import { mongoClient } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { ordersCollection, toOrder, type OrderDocument } from "@/lib/orders";

const DELIVERY_DAYS = 5;
const MAX_QUANTITY = 99;

type OrderResult = { order: Order; error?: never } | { order?: never; error: string };

class OrderError extends Error {}

const generateOrderNumber = () => `W${randomBytes(5).toString("hex").toUpperCase()}`;

const isValidItem = (item: CartItem) =>
  ObjectId.isValid(item.productId) &&
  Number.isInteger(item.quantity) &&
  item.quantity > 0 &&
  item.quantity <= MAX_QUANTITY;

const findVariant = (product: CatalogProduct, item: CartItem): ProductVariant | undefined => {
  if (item.variant) {
    return product.variants.find(
      (variant) => variant.storage === (item.variant?.storage ?? "") && variant.color.hex === (item.variant?.colorHex ?? "")
    );
  }

  return [...product.variants]
    .filter((variant) => variant.inventory >= item.quantity)
    .sort((a, b) => a.price - b.price)[0];
};

const loadProducts = async (items: CartItem[]) => {
  const ids = [...new Set(items.map((item) => item.productId))].map((id) => new ObjectId(id));
  const documents = await productsCollection.find({ _id: { $in: ids }, status: "active" }).toArray();
  return new Map(documents.map((document) => [String(document._id), toCatalogProduct(document)]));
};

const priceItems = (items: CartItem[], products: Map<string, CatalogProduct>) =>
  items.map((item) => {
    const product = products.get(item.productId);
    if (!product) throw new OrderError(`"${item.title}" is no longer available. Please remove it from your bag.`);

    const variant = findVariant(product, item);
    if (!variant || variant.inventory < item.quantity) {
      const remaining = variant?.inventory ?? 0;
      throw new OrderError(
        remaining > 0
          ? `Only ${remaining} of "${product.title}" left in stock. Please update your bag.`
          : `"${product.title}" is out of stock. Please remove it from your bag.`
      );
    }

    return {
      variantId: variant.id,
      item: {
        id: item.id,
        productId: product.id,
        title: product.title,
        handle: product.handle,
        price: variant.price,
        image: variant.image || product.images[0],
        quantity: item.quantity,
        variant: variant.storage || variant.color.hex
          ? { storage: variant.storage, colorHex: variant.color.hex, colorName: variant.color.name }
          : undefined,
      } satisfies CartItem,
    };
  });

export async function createOrder(items: CartItem[], checkout: CheckoutDetails): Promise<OrderResult> {
  if (!items.length || !items.every(isValidItem)) {
    return { error: "Your bag contains items that are no longer available. Please remove them and try again." };
  }

  const { details, error: checkoutError } = sanitizeCheckoutDetails(checkout);
  if (!details) {
    return { error: checkoutError ?? "Please check your checkout details." };
  }

  const session = await getSession();
  const createdAt = new Date();
  const estimatedDelivery = new Date(createdAt);
  estimatedDelivery.setDate(createdAt.getDate() + DELIVERY_DAYS);

  try {
    const pricedItems = priceItems(items, await loadProducts(items));
    const order: OrderDocument = {
      orderNumber: generateOrderNumber(),
      userId: session?.user.id ?? null,
      items: pricedItems.map(({ item }) => item),
      subtotal: pricedItems.reduce((total, { item }) => total + item.price * item.quantity, 0),
      paymentMethod: details.paymentMethod,
      contact: details.contact,
      shippingAddress: details.shippingAddress,
      billingAddress: details.billingAddress,
      card: details.card,
      status: "placed",
      createdAt,
      estimatedDelivery,
    };

    await mongoClient.withSession((dbSession) =>
      dbSession.withTransaction(async () => {
        for (const { item, variantId } of pricedItems) {
          const { modifiedCount } = await productsCollection.updateOne(
            {
              _id: new ObjectId(item.productId),
              variants: { $elemMatch: { id: variantId, inventory: { $gte: item.quantity } } },
            },
            { $inc: { "variants.$.inventory": -item.quantity } },
            { session: dbSession }
          );
          if (!modifiedCount) throw new OrderError(`"${item.title}" just sold out. Please update your bag.`);
        }
        await ordersCollection.insertOne(order, { session: dbSession });
      })
    );

    revalidatePath("/", "layout");
    return { order: toOrder(order) };
  } catch (error) {
    if (error instanceof OrderError) return { error: error.message };
    throw error;
  }
}
