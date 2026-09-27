import type { Metadata } from "next";
import LoginView from "@/components/pages/Auth/LoginView";
import { enabledSocialProviders } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign In | Apple",
  description: "Sign in to your Apple Store account for faster checkout and order tracking.",
};

export default async function LoginPage({ searchParams }: PageProps<"/account/login">) {
  const { error } = await searchParams;
  const socialError = error ? "We couldn't sign you in with that account. Please try again." : undefined;

  return <LoginView enabledProviders={enabledSocialProviders} socialError={socialError} />;
}
