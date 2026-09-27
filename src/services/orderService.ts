import type { CartItem } from "@/context/CartContext";
import type { CheckoutDetails, Order } from "@/types/order";
import { createOrder } from "@/actions/orderActions";

const LAST_ORDER_KEY = "apple_last_order";

export const placeOrder = async (items: CartItem[], details: CheckoutDetails) => {
  const result = await createOrder(items, details);
  if (result.order) {
    sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(result.order));
  }
  return result;
};

export const readLastOrder = () => sessionStorage.getItem(LAST_ORDER_KEY);

export const parseOrder = (raw: string | null): Order | null => {
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Order;
  } catch {
    return null;
  }
};
