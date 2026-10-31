import CheckoutClient from "@/components/pages/Checkout/CheckoutClient";
import { assistantConfig } from "@/config/env";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: `Checkout | ${siteConfig.name}`,
  description: "Secure checkout for your Apple products.",
};

export default function CheckoutPage() {
  return <CheckoutClient checkAddressWithAi={assistantConfig.isEnabled} />;
}
