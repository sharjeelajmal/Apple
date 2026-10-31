import "server-only";
import type { ObjectId } from "mongodb";
import type { CartItem } from "@/context/CartContext";
import type { CardSummary, CheckoutContact, Order, OrderAddress, OrderStatus, PaymentMethod, ReturnStatus } from "@/types/order";
import { db } from "./mongodb";

export type OrderDocument = {
  _id?: ObjectId;
  orderNumber: string;
  userId: string | null;
  items: CartItem[];
  subtotal: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: Date;
  estimatedDelivery: Date;
  contact?: CheckoutContact;
  shippingAddress?: OrderAddress;
  billingAddress?: OrderAddress;
  card?: CardSummary | null;
  deliveredAt?: Date;
  returnRequest?: {
    status: ReturnStatus;
    reason: string;
    requestedAt: Date;
    resolvedAt?: Date;
  } | null;
};

export const ordersCollection = db.collection<OrderDocument>("orders");

export const toOrder = (document: OrderDocument): Order => ({
  id: document.orderNumber,
  items: document.items,
  subtotal: document.subtotal,
  paymentMethod: document.paymentMethod,
  status: document.status,
  placedAt: document.createdAt.toISOString(),
  estimatedDelivery: document.estimatedDelivery.toISOString(),
  contact: document.contact,
  shippingAddress: document.shippingAddress,
  billingAddress: document.billingAddress,
  card: document.card ?? null,
  returnRequest: document.returnRequest
    ? {
        status: document.returnRequest.status,
        reason: document.returnRequest.reason,
        requestedAt: document.returnRequest.requestedAt.toISOString(),
        resolvedAt: document.returnRequest.resolvedAt?.toISOString(),
      }
    : null,
});

export const getOrdersForUser = async (userId: string) => {
  const documents = await ordersCollection.find({ userId }).sort({ createdAt: -1 }).toArray();
  return documents.map(toOrder);
};
