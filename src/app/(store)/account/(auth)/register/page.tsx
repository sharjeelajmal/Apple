import type { Metadata } from "next";
import RegisterView from "@/components/pages/Auth/RegisterView";
import { enabledSocialProviders } from "@/lib/auth";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Create Account | ${siteConfig.name}`,
  description: `Create your ${siteConfig.name} account to track orders and check out faster.`,
};

export default function RegisterPage() {
  return <RegisterView enabledProviders={enabledSocialProviders} />;
}
