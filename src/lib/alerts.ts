import "server-only";
import type { AlertType, ProductAlert } from "@/types/alert";
import type { ProductInput } from "@/types/catalog";
import { getStartingPrice, getTotalInventory, productsCollection } from "./catalog";
import { db } from "./mongodb";
import { toObjectId } from "./objectId";

type AlertDocument = {
  userId: string;
  email: string;
  productId: string;
  type: AlertType;
  priceAtSubscribe: number;
  createdAt: Date;
  triggeredAt: Date | null;
  triggeredPrice: number | null;
};

export const alertsCollection = db.collection<AlertDocument>("product_alerts");

export const getAlertType = (product: Pick<ProductInput, "variants">): AlertType =>
  getTotalInventory(product) > 0 ? "price-drop" : "back-in-stock";

export async function hasActiveAlert(userId: string, productId: string) {
  const alert = await alertsCollection.findOne({ userId, productId, triggeredAt: null }, { projection: { _id: 1 } });
  return Boolean(alert);
}

export async function processProductAlerts(productId: string, product: ProductInput) {
  if (product.status !== "active") return;

  const now = new Date();
  const price = getStartingPrice(product);
  const pending = { productId, triggeredAt: null };

  await alertsCollection.updateMany(
    { ...pending, type: "price-drop", priceAtSubscribe: { $gt: price } },
    { $set: { triggeredAt: now, triggeredPrice: price } }
  );

  if (getTotalInventory(product) > 0) {
    await alertsCollection.updateMany(
      { ...pending, type: "back-in-stock" },
      { $set: { triggeredAt: now, triggeredPrice: price } }
    );
  }
}

export async function getUserAlerts(userId: string): Promise<ProductAlert[]> {
  const alerts = await alertsCollection.find({ userId }).sort({ triggeredAt: -1, createdAt: -1 }).toArray();
  const productIds = alerts.flatMap((alert) => toObjectId(alert.productId) ?? []);
  const products = await productsCollection.find({ _id: { $in: productIds }, status: "active" }).toArray();
  const byId = new Map(products.map((product) => [String(product._id), product]));

  return alerts.flatMap((alert) => {
    const product = byId.get(alert.productId);
    if (!product) return [];

    return {
      id: String(alert._id),
      type: alert.type,
      productTitle: product.title,
      productHandle: product.handle,
      productImage: product.images[0] ?? "",
      priceAtSubscribe: alert.priceAtSubscribe,
      currentPrice: getStartingPrice(product),
      triggeredAt: alert.triggeredAt?.toISOString() ?? null,
      triggeredPrice: alert.triggeredPrice,
      createdAt: alert.createdAt.toISOString(),
    };
  });
}

export async function countTriggeredAlerts(userId: string) {
  return alertsCollection.countDocuments({ userId, triggeredAt: { $ne: null } });
}
