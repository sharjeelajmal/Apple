import type { Metadata } from "next";
import RegisterView from "@/components/pages/Auth/RegisterView";
import { enabledSocialProviders } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Create Account | Apple",
  description: "Create your Apple Store account to track orders and check out faster.",
};

export default function RegisterPage() {
  return <RegisterView enabledProviders={enabledSocialProviders} />;
}
