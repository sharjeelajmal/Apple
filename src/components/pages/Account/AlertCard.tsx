"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { BellRing, Trash2 } from "lucide-react";
import { removeAlert } from "@/actions/alertActions";
import { formatLongDate, formatPrice } from "@/lib/format";
import type { ProductAlert } from "@/types/alert";

const getAlertMessage = (alert: ProductAlert) => {
  if (alert.triggeredAt) {
    return alert.type === "price-drop"
      ? `Price dropped from ${formatPrice(alert.priceAtSubscribe)} to ${formatPrice(alert.triggeredPrice ?? alert.currentPrice)}`
      : "Back in stock and ready to order";
  }
  return alert.type === "price-drop"
    ? `Watching for a price below ${formatPrice(alert.priceAtSubscribe)}`
    : "Waiting for it to come back in stock";
};

export default function AlertCard({ alert }: { alert: ProductAlert }) {
  const [isPending, startTransition] = useTransition();
  const isTriggered = Boolean(alert.triggeredAt);

  return (
    <li
      className={`flex flex-col gap-4 rounded-card border bg-surface p-4 shadow-soft transition-opacity sm:flex-row sm:items-center md:p-5 ${
        isTriggered ? "border-positive/40" : "border-line-light"
      } ${isPending ? "opacity-60" : ""}`}
    >
      <Link
        href={`/products/${alert.productHandle}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-field bg-white shadow-subtle"
      >
        <Image src={alert.productImage} alt={alert.productTitle} fill sizes="80px" className="object-contain p-2" />
      </Link>

      <div className="flex-1">
        <Link href={`/products/${alert.productHandle}`} className="text-[16px] font-semibold text-ink hover:text-accent">
          {alert.productTitle}
        </Link>
        <p className={`mt-1 flex items-center gap-1.5 text-[14px] ${isTriggered ? "font-medium text-positive" : "text-ink-muted"}`}>
          {isTriggered && <BellRing size={15} />}
          {getAlertMessage(alert)}
        </p>
        <p className="mt-1 text-[13px] text-ink-subtle">
          {alert.triggeredAt ? `Updated ${formatLongDate(alert.triggeredAt)}` : `Since ${formatLongDate(alert.createdAt)}`} · Now{" "}
          {formatPrice(alert.currentPrice)}
        </p>
      </div>

      <div className="flex gap-2">
        {isTriggered && (
          <Link
            href={`/products/${alert.productHandle}`}
            className="flex h-9 items-center rounded-full bg-accent px-4 text-[13px] font-medium text-white hover:bg-accent-hover"
          >
            Buy now
          </Link>
        )}
        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => removeAlert(alert.id))}
          aria-label={`Remove alert for ${alert.productTitle}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-muted hover:border-danger hover:text-danger"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </li>
  );
}
