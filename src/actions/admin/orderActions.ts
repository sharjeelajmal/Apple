"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/adminAuth";
import { cancelOrderAndRestock, resolveOrderReturn } from "@/lib/orderChanges";
import { ordersCollection } from "@/lib/orders";
import { orderStatusLabels, type OrderStatus } from "@/types/order";

const refreshOrders = () => {
  revalidatePath("/admin", "layout");
  revalidatePath("/account", "layout");
};

export async function updateOrderStatus(orderNumber: string, status: OrderStatus) {
  await assertAdmin();

  if (!(status in orderStatusLabels)) {
    throw new Error("Invalid order status.");
  }

  if (status === "cancelled") {
    await cancelOrderAndRestock(orderNumber);
  } else {
    await ordersCollection.updateOne(
      { orderNumber, status: { $ne: "cancelled" } },
      { $set: { status, ...(status === "delivered" && { deliveredAt: new Date() }) } }
    );
  }
  refreshOrders();
}

export async function resolveReturn(orderNumber: string, approve: boolean) {
  await assertAdmin();
  await resolveOrderReturn(orderNumber, approve);
  refreshOrders();
}
