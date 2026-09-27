"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import OrderItemsList from "@/components/shared/order/OrderItemsList";
import OrderProgress from "@/components/shared/order/OrderProgress";
import OrderStatusBadge from "@/components/shared/order/OrderStatusBadge";
import { formatDate, formatPrice, resolveImageUrl } from "@/lib/format";
import { paymentMethodLabels, type Order } from "@/types/order";

const MAX_PREVIEW_IMAGES = 3;

interface OrderCardProps {
  order: Order;
  defaultExpanded?: boolean;
}

export default function OrderCard({ order, defaultExpanded = false }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);
  const previewItems = order.items.slice(0, MAX_PREVIEW_IMAGES);
  const hiddenCount = order.items.length - previewItems.length;

  return (
    <article className="overflow-hidden rounded-card border border-line-light bg-surface shadow-soft">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        className="flex w-full flex-wrap items-center gap-4 p-5 text-left md:flex-nowrap md:p-6"
      >
        <div className="flex -space-x-3">
          {previewItems.map((item) => (
            <span
              key={item.id}
              className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-surface bg-surface-muted p-2"
            >
              <img src={resolveImageUrl(item.image)} alt={item.title} className="h-full w-full object-contain" />
            </span>
          ))}
          {hiddenCount > 0 && (
            <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-surface bg-line-light text-[13px] font-semibold text-ink">
              +{hiddenCount}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-ink">Order {order.id}</p>
          <p className="text-[13px] text-ink-muted">
            {formatDate(order.placedAt, { year: "numeric" })} · {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>

        <OrderStatusBadge status={order.status} />
        <span className="text-[17px] font-semibold text-ink">{formatPrice(order.subtotal)}</span>
        <ChevronDown
          size={20}
          className={`text-ink-subtle transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-line-light p-5 md:p-6">
              {order.status !== "cancelled" && (
                <div className="mb-8">
                  <p className="mb-5 text-[14px] text-ink-muted">
                    Estimated delivery{" "}
                    <span className="font-semibold text-ink">
                      {formatDate(order.estimatedDelivery, { weekday: "long", month: "long" })}
                    </span>
                  </p>
                  <OrderProgress status={order.status} />
                </div>
              )}
              <OrderItemsList items={order.items} />
              <dl className="mt-6 flex flex-col gap-2 border-t border-line-light pt-6 text-[14px]">
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Payment</dt>
                  <dd className="text-ink">{paymentMethodLabels[order.paymentMethod]}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Shipping</dt>
                  <dd className="text-ink">Free</dd>
                </div>
                <div className="flex justify-between text-[17px] font-semibold text-ink">
                  <dt>Total</dt>
                  <dd>{formatPrice(order.subtotal)}</dd>
                </div>
              </dl>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
