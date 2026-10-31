"use client";

import { Bell } from "lucide-react";
import { useState, useTransition } from "react";
import Link from "next/link";
import { toggleProductAlert } from "@/actions/alertActions";
import { AUTH_ROUTES } from "@/config/auth";

type ProductAlertButtonProps = {
  productId: string;
  isSoldOut: boolean;
  isSignedIn: boolean;
  initialSubscribed: boolean;
};

export default function ProductAlertButton({ productId, isSoldOut, isSignedIn, initialSubscribed }: ProductAlertButtonProps) {
  const [isSubscribed, setIsSubscribed] = useState(initialSubscribed);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const label = isSoldOut ? "Notify me when it's back in stock" : "Alert me if the price drops";
  const activeLabel = isSoldOut ? "We'll let you know when it's back" : "We'll let you know if the price drops";

  if (!isSignedIn) {
    return (
      <p className="mt-6 flex items-center gap-2 text-[14px] text-ink-muted">
        <Bell size={16} />
        <Link href={AUTH_ROUTES.login} className="font-medium text-accent hover:underline">
          Sign in
        </Link>
        {isSoldOut ? "to get notified when it's back in stock." : "to get an alert if the price drops."}
      </p>
    );
  }

  const handleClick = () => {
    startTransition(async () => {
      const result = await toggleProductAlert(productId);
      setError(result.error ?? "");
      if (!result.error) setIsSubscribed(result.subscribed);
    });
  };

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-pressed={isSubscribed}
        className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-[14px] font-medium transition-colors disabled:opacity-60 ${
          isSubscribed ? "border-accent bg-accent/5 text-accent" : "border-line text-ink hover:border-ink"
        }`}
      >
        <Bell size={16} className={isSubscribed ? "animate-pulse" : ""} />
        {isSubscribed ? activeLabel : label}
      </button>
      {isSubscribed && (
        <p className="mt-2 text-[13px] text-ink-muted">
          Track it in{" "}
          <Link href="/account/alerts" className="text-accent hover:underline">
            your alerts
          </Link>
          . Tap again to stop.
        </p>
      )}
      {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
    </div>
  );
}
