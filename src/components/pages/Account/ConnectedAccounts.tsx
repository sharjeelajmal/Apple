"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import type { IconType } from "react-icons";
import FormAlert from "@/components/ui/FormAlert";
import Spinner from "@/components/ui/Spinner";
import { authClient } from "@/lib/authClient";
import type { SocialProvider } from "@/config/auth";

const providers: { id: SocialProvider; name: string; icon: IconType }[] = [
  { id: "google", name: "Google", icon: FcGoogle },
];

type LinkedAccount = {
  id: string;
  providerId: string;
};

interface ConnectedAccountsProps {
  linkedAccounts: LinkedAccount[];
  enabledProviders: SocialProvider[];
}

export default function ConnectedAccounts({ linkedAccounts, enabledProviders }: ConnectedAccountsProps) {
  const router = useRouter();
  const [pendingProvider, setPendingProvider] = useState<SocialProvider | null>(null);
  const [error, setError] = useState("");
  const canUnlink = linkedAccounts.length > 1;

  const handleLink = async (provider: SocialProvider) => {
    setPendingProvider(provider);
    setError("");
    const { error: linkError } = await authClient.linkSocial({
      provider,
      callbackURL: "/account/settings",
    });

    if (linkError) {
      setError(linkError.message ?? "Unable to connect this account.");
      setPendingProvider(null);
    }
  };

  const handleUnlink = async (provider: SocialProvider, accountId: string) => {
    setPendingProvider(provider);
    setError("");
    const { error: unlinkError } = await authClient.unlinkAccount({ accountId });
    setPendingProvider(null);

    if (unlinkError) {
      setError(unlinkError.message ?? "Unable to disconnect this account.");
      return;
    }

    router.refresh();
  };

  return (
    <div className="flex flex-col gap-3">
      <FormAlert message={error} />
      <ul className="divide-y divide-line-light">
        {providers.map(({ id, name, icon: Icon }) => {
          const linkedAccount = linkedAccounts.find((account) => account.providerId === id);
          const isAvailable = enabledProviders.includes(id);
          const isPending = pendingProvider === id;

          return (
            <li key={id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-muted">
                <Icon size={22} />
              </span>
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-ink">{name}</p>
                <p className="text-[13px] text-ink-muted">
                  {linkedAccount ? "Connected" : isAvailable ? "Not connected" : "Coming soon"}
                </p>
              </div>
              {isAvailable && (
                <button
                  type="button"
                  disabled={pendingProvider !== null || (linkedAccount && !canUnlink)}
                  onClick={() => (linkedAccount ? handleUnlink(id, linkedAccount.id) : handleLink(id))}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-medium transition-colors disabled:opacity-50 ${
                    linkedAccount
                      ? "border border-line text-ink hover:bg-surface-muted"
                      : "bg-accent text-white hover:bg-accent-hover"
                  }`}
                >
                  {isPending && <Spinner className="h-3.5 w-3.5" />}
                  {linkedAccount ? "Disconnect" : "Connect"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
