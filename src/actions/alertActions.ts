"use server";

import { revalidatePath } from "next/cache";
import { alertsCollection, getAlertType } from "@/lib/alerts";
import { getProductById, getStartingPrice } from "@/lib/catalog";
import { toObjectId } from "@/lib/objectId";
import { getSession } from "@/lib/session";
import type { AlertToggleResult } from "@/types/alert";

export async function toggleProductAlert(productId: string): Promise<AlertToggleResult> {
  const session = await getSession();
  if (!session) return { subscribed: false, error: "Please sign in to get alerts." };

  const product = await getProductById(productId);
  if (product?.status !== "active") return { subscribed: false, error: "This product is no longer available." };

  const userId = session.user.id;
  const { deletedCount } = await alertsCollection.deleteMany({ userId, productId, triggeredAt: null });

  if (!deletedCount) {
    await alertsCollection.insertOne({
      userId,
      email: session.user.email,
      productId,
      type: getAlertType(product),
      priceAtSubscribe: getStartingPrice(product),
      createdAt: new Date(),
      triggeredAt: null,
      triggeredPrice: null,
    });
  }

  revalidatePath("/account/alerts");
  return { subscribed: !deletedCount };
}

export async function removeAlert(alertId: string) {
  const session = await getSession();
  const id = toObjectId(alertId);
  if (!session || !id) return;

  await alertsCollection.deleteOne({ _id: id, userId: session.user.id });
  revalidatePath("/account/alerts");
}
