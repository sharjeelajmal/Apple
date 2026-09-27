import "server-only";
import type { Filter } from "mongodb";
import { LOW_STOCK_THRESHOLD } from "@/config/inventory";
import type { OrderStatus } from "@/types/order";
import { productsCollection, type ProductDocument } from "./catalog";
import { messagesCollection } from "./messages";
import { db } from "./mongodb";
import { ordersCollection, toOrder, type OrderDocument } from "./orders";

const RECENT_ORDERS_LIMIT = 5;

const lowStockFilter: Filter<ProductDocument> = {
  variants: { $elemMatch: { inventory: { $lte: LOW_STOCK_THRESHOLD } } },
};

export async function getDashboardStats() {
  const [productCount, lowStockCount, orderCount, revenue, customerCount, newMessageCount, recentOrders] =
    await Promise.all([
      productsCollection.countDocuments(),
      productsCollection.countDocuments(lowStockFilter),
      ordersCollection.countDocuments(),
      ordersCollection
        .aggregate<{ total: number }>([
          { $match: { status: { $ne: "cancelled" } } },
          { $group: { _id: null, total: { $sum: "$subtotal" } } },
        ])
        .toArray(),
      db.collection("user").countDocuments(),
      messagesCollection.countDocuments({ status: "new" }),
      ordersCollection.find().sort({ createdAt: -1 }).limit(RECENT_ORDERS_LIMIT).toArray(),
    ]);

  return {
    productCount,
    lowStockCount,
    orderCount,
    revenue: revenue[0]?.total ?? 0,
    customerCount,
    newMessageCount,
    recentOrders: recentOrders.map(toOrder),
  };
}

export async function getAllOrders(status?: OrderStatus) {
  const filter: Filter<OrderDocument> = status ? { status } : {};
  const documents = await ordersCollection.find(filter).sort({ createdAt: -1 }).toArray();
  return documents.map((document) => ({ ...toOrder(document), isGuest: !document.userId }));
}
