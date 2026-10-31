import PaymentClient from "@/components/pages/Checkout/PaymentClient";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: `Payment | ${siteConfig.name}`,
  description: "Secure payment for your Apple products.",
};

export default function PaymentPage() {
  return <PaymentClient />;
}
