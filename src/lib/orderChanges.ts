import "server-only";
import { ObjectId, type ClientSession } from "mongodb";
import { productsCollection } from "./catalog";
import { mongoClient } from "./mongodb";
import { ordersCollection, type OrderDocument } from "./orders";

export const RETURN_WINDOW_DAYS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;
const CANCELLABLE_STATUSES = new Set(["placed", "processing"]);

export type OrderChangeResult = { ok: true; message: string } | { ok: false; message: string };

async function restockItems(order: OrderDocument, session: ClientSession) {
  for (const item of order.items) {
    if (!ObjectId.isValid(item.productId)) continue;

    const variantMatch = item.variant
      ? { storage: item.variant.storage ?? "", "color.hex": item.variant.colorHex ?? "" }
      : {};
    await productsCollection.updateOne(
      { _id: new ObjectId(item.productId), variants: { $elemMatch: variantMatch } },
      { $inc: { "variants.$.inventory": item.quantity } },
      { session }
    );
  }
}

export async function cancelOrderAndRestock(orderNumber: string, ownerId?: string): Promise<OrderChangeResult> {
  return mongoClient.withSession((session) =>
    session.withTransaction(async () => {
      const order = await ordersCollection.findOne(
        { orderNumber, ...(ownerId && { userId: ownerId }) },
        { session }
      );
      if (!order) return { ok: false, message: "No order with that number was found on this account." };
      if (order.status === "cancelled") return { ok: false, message: `Order ${orderNumber} is already cancelled.` };
      if (ownerId && !CANCELLABLE_STATUSES.has(order.status)) {
        return {
          ok: false,
          message: `Order ${orderNumber} has already ${order.status === "shipped" ? "shipped" : "been delivered"}, so it can't be cancelled. A return can be requested after delivery.`,
        };
      }

      await ordersCollection.updateOne({ orderNumber }, { $set: { status: "cancelled" } }, { session });
      await restockItems(order, session);
      return { ok: true, message: `Order ${orderNumber} has been cancelled. The refund goes back to the original payment method within 5–7 business days.` };
    })
  );
}

export async function requestOrderReturn(orderNumber: string, ownerId: string, reason: string): Promise<OrderChangeResult> {
  const order = await ordersCollection.findOne({ orderNumber, userId: ownerId });
  if (!order) return { ok: false, message: "No order with that number was found on this account." };
  if (order.status !== "delivered") {
    return { ok: false, message: `Order ${orderNumber} hasn't been delivered yet, so a return can't be requested. It can be cancelled instead if it hasn't shipped.` };
  }
  if (order.returnRequest) {
    return { ok: false, message: `A return for order ${orderNumber} was already requested and is ${order.returnRequest.status}.` };
  }

  const deliveredAt = order.deliveredAt ?? order.estimatedDelivery;
  if (Date.now() - deliveredAt.getTime() > RETURN_WINDOW_DAYS * DAY_MS) {
    return { ok: false, message: `Order ${orderNumber} was delivered more than ${RETURN_WINDOW_DAYS} days ago, so it's outside the return window.` };
  }

  await ordersCollection.updateOne(
    { orderNumber },
    { $set: { returnRequest: { status: "requested", reason: reason.slice(0, 500), requestedAt: new Date() } } }
  );
  return {
    ok: true,
    message: `Return requested for order ${orderNumber}. Our team will review it and email a prepaid shipping label. The refund is issued 5–7 business days after the item is checked.`,
  };
}

export async function resolveOrderReturn(orderNumber: string, approve: boolean) {
  await ordersCollection.updateOne(
    { orderNumber, "returnRequest.status": "requested" },
    { $set: { "returnRequest.status": approve ? "approved" : "rejected", "returnRequest.resolvedAt": new Date() } }
  );
}
