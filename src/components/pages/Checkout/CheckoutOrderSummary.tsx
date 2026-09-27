"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { CartItem } from "@/context/CartContext";
import { formatPrice, resolveImageUrl } from "@/lib/format";

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  subtotal: number;
}

export default function CheckoutOrderSummary({ items, subtotal }: CheckoutOrderSummaryProps) {
  return (
    <div className="sticky top-[100px] rounded-2xl border border-line-light bg-surface p-6 shadow-sm md:p-8">
      <h2 className="mb-6 text-[24px] font-semibold text-ink">Order Summary</h2>

      <div className="no-scrollbar mb-6 flex max-h-[350px] flex-col gap-6 overflow-y-auto border-b border-line pb-6 pr-2">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div key={item.id} layout className="flex items-center gap-4">
              <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-lg bg-surface-muted p-2">
                <img src={resolveImageUrl(item.image)} alt={item.title} className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[15px] font-semibold text-ink">{item.title}</h3>
                {item.variant?.colorName && (
                  <p className="truncate text-[13px] text-ink-muted">
                    {[item.variant.storage, item.variant.colorName].filter(Boolean).join(" - ")}
                  </p>
                )}
                <p className="text-[13px] text-ink-muted">Qty: {item.quantity}</p>
              </div>
              <div className="shrink-0 text-[15px] font-semibold text-ink">{formatPrice(item.price * item.quantity)}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <dl className="mb-6 flex flex-col gap-3 text-[15px]">
        <div className="flex justify-between">
          <dt className="text-ink-muted">Subtotal</dt>
          <dd className="font-medium text-ink">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-muted">Shipping</dt>
          <dd className="font-medium text-ink">Free</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-muted">Estimated Tax</dt>
          <dd className="font-medium text-ink">Calculated at checkout</dd>
        </div>
      </dl>

      <div className="flex items-center justify-between border-t border-line pt-6">
        <span className="text-[20px] font-semibold text-ink">Total</span>
        <span className="text-[24px] font-semibold text-ink">{formatPrice(subtotal)}</span>
      </div>
    </div>
  );
}
