import type { CartItem } from "@/context/CartContext";

export type PaymentMethod = "visa" | "mastercard" | "card" | "paypal" | "googlepay";

export const CARD_PAYMENT_METHODS: PaymentMethod[] = ["visa", "mastercard", "card"];

export const isCardPayment = (method: PaymentMethod) => CARD_PAYMENT_METHODS.includes(method);

export type OrderStatus = "placed" | "processing" | "shipped" | "delivered" | "cancelled";

export type CheckoutContact = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type OrderAddress = {
  street: string;
  apartment: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type CardSummary = {
  brand: string;
  cardNumber?: string;
  last4: string;
  expiry: string;
  holderName: string;
};

export type CheckoutDetails = {
  contact: CheckoutContact;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  paymentMethod: PaymentMethod;
  card: CardSummary | null;
};

export type Order = {
  id: string;
  items: CartItem[];
  subtotal: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  placedAt: string;
  estimatedDelivery: string;
  contact?: CheckoutContact;
  shippingAddress?: OrderAddress;
  billingAddress?: OrderAddress;
  card?: CardSummary | null;
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  card: "Credit or Debit Card",
  paypal: "PayPal",
  googlepay: "Google Pay",
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  placed: "Order placed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
