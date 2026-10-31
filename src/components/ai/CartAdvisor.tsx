"use client";

import { Cpu, Gem, HardDrive, Lightbulb, Link2, Sparkles, type LucideIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { getCartAdvice } from "@/actions/aiActions";
import AssistantProductCard from "@/components/assistant/AssistantProductCard";
import type { CartItem } from "@/context/CartContext";
import type { ProductCardData } from "@/types/catalog";
import AiBadge from "./AiBadge";
import AiLoading from "./AiLoading";

type CartTipView = {
  kind: "pairing" | "storage" | "compatibility" | "value" | "other";
  message: string;
  product: ProductCardData | null;
};

const tipIcons: Record<CartTipView["kind"], LucideIcon> = {
  pairing: Link2,
  storage: HardDrive,
  compatibility: Cpu,
  value: Gem,
  other: Lightbulb,
};

const cartSignature = (items: CartItem[]) => items.map((item) => `${item.id}x${item.quantity}`).join("|");

export default function CartAdvisor({ items }: { items: CartItem[] }) {
  const [advice, setAdvice] = useState<{ signature: string; summary: string; tips: CartTipView[] } | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const signature = cartSignature(items);
  const isStale = advice !== null && advice.signature !== signature;

  const checkBag = () =>
    startTransition(async () => {
      const result = await getCartAdvice(items);
      setError(result.error ?? "");
      setAdvice(result.data ? { signature, ...result.data } : null);
    });

  return (
    <section aria-label="AI bag check" className="mt-10 rounded-2xl border border-line-light p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <AiBadge label="AI bag check" />
          <h2 className="mt-3 text-[21px] font-semibold text-ink">Is your bag ready?</h2>
          <p className="mt-1 text-[14px] text-ink-muted">Get advice on storage, accessories that pair well and better-value options.</p>
        </div>
        {(!advice || isStale) && !isPending && (
          <button
            type="button"
            onClick={checkBag}
            className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-white hover:bg-black"
          >
            <Sparkles size={16} />
            {isStale ? "Check again" : "Check my bag"}
          </button>
        )}
      </div>

      {isPending && (
        <div className="mt-6">
          <AiLoading message="AI is reviewing your bag…" />
        </div>
      )}
      {error && <p className="mt-4 text-[14px] text-danger">{error}</p>}

      {advice && !isPending && (
        <div className={`mt-6 flex flex-col gap-4 ${isStale ? "opacity-50" : ""}`}>
          <p className="text-[16px] text-ink">{advice.summary}</p>
          <ul className="grid gap-3 md:grid-cols-2">
            {advice.tips.map((tip) => {
              const Icon = tipIcons[tip.kind];
              return (
                <li key={tip.message} className="flex flex-col gap-3 rounded-field bg-surface-muted p-4">
                  <p className="flex gap-3 text-[14px] leading-relaxed text-ink">
                    <Icon size={18} className="mt-0.5 shrink-0 text-accent" />
                    {tip.message}
                  </p>
                  {tip.product && <AssistantProductCard product={tip.product} onNavigate={() => undefined} />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
