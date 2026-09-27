"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import type { IconType } from "react-icons";
import Spinner from "@/components/ui/Spinner";
import FormAlert from "@/components/ui/FormAlert";
import { authClient } from "@/lib/authClient";
import { AUTH_ROUTES, type SocialProvider } from "@/config/auth";

type ProviderButton = {
  id: SocialProvider;
  name: string;
  icon: IconType;
  className: string;
};

const providerButtons: ProviderButton[] = [
  {
    id: "google",
    name: "Google",
    icon: FcGoogle,
    className: "border border-line bg-surface text-ink hover:bg-surface-muted",
  },
];

interface SocialAuthButtonsProps {
  enabledProviders: SocialProvider[];
  errorRedirect: string;
}

export default function SocialAuthButtons({ enabledProviders, errorRedirect }: SocialAuthButtonsProps) {
  const [pendingProvider, setPendingProvider] = useState<SocialProvider | null>(null);
  const [error, setError] = useState("");

  const handleSignIn = async ({ id, name }: ProviderButton) => {
    setError("");

    if (!enabledProviders.includes(id)) {
      setError(`${name} sign-in isn't available yet. Please use your email instead.`);
      return;
    }

    setPendingProvider(id);
    const { error: signInError } = await authClient.signIn.social({
      provider: id,
      callbackURL: AUTH_ROUTES.dashboard,
      errorCallbackURL: errorRedirect,
    });

    if (signInError) {
      setError(signInError.message ?? "Something went wrong. Please try again.");
      setPendingProvider(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <FormAlert message={error} />
      {providerButtons.map((provider) => {
        const { id, name, icon: Icon, className } = provider;

        return (
          <button
            key={id}
            type="button"
            disabled={pendingProvider !== null}
            onClick={() => handleSignIn(provider)}
            className={`flex h-12 w-full items-center justify-center gap-2 rounded-full text-[15px] font-medium transition-colors duration-300 ease-smooth disabled:opacity-70 ${className}`}
          >
            {pendingProvider === id ? <Spinner className="h-4 w-4" /> : <Icon size={20} />}
            Continue with {name}
          </button>
        );
      })}
    </div>
  );
}
