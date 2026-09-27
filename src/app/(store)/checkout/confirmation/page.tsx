import type { Metadata } from "next";
import OrderConfirmationClient from "@/components/pages/Checkout/Confirmation/OrderConfirmationClient";

export const metadata: Metadata = {
  title: "Order Confirmed | Apple",
  description: "Your Apple order has been placed successfully.",
};

export default function OrderConfirmationPage() {
  return <OrderConfirmationClient />;
}
