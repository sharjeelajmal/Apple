import type { Metadata } from "next";
import OrderConfirmationClient from "@/components/pages/Checkout/Confirmation/OrderConfirmationClient";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Order Confirmed | ${siteConfig.name}`,
  description: "Your Apple order has been placed successfully.",
};

export default function OrderConfirmationPage() {
  return <OrderConfirmationClient />;
}
