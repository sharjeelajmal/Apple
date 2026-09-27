"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/adminAuth";
import { ordersCollection } from "@/lib/orders";
import { orderStatusLabels, type OrderStatus } from "@/types/order";

export async function updateOrderStatus(orderNumber: string, status: OrderStatus) {
  await assertAdmin();

  if (!(status in orderStatusLabels)) {
    throw new Error("Invalid order status.");
  }

  await ordersCollection.updateOne({ orderNumber }, { $set: { status } });
  revalidatePath("/admin", "layout");
  revalidatePath("/account", "layout");
}
