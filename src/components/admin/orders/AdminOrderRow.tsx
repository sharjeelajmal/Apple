"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import OrderItemsList from "@/components/shared/order/OrderItemsList";
import { formatDate, formatPrice } from "@/lib/format";
import { paymentMethodLabels, type Order } from "@/types/order";
import OrderCustomerDetails from "./OrderCustomerDetails";
import OrderStatusSelect from "./OrderStatusSelect";

interface AdminOrderRowProps {
  order: Order & { isGuest: boolean };
}

export default function AdminOrderRow({ order }: AdminOrderRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <li className="rounded-card border border-line-light bg-surface shadow-soft">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 p-5">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <ChevronDown size={18} className={`shrink-0 text-ink-subtle transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          <span className="min-w-0">
            <span className="block font-semibold text-ink">Order {order.id}</span>
            <span className="block text-[13px] text-ink-muted">
              {formatDate(order.placedAt, { year: "numeric", hour: "numeric", minute: "2-digit" })} · {itemCount}{" "}
              {itemCount === 1 ? "item" : "items"} ·{" "}
              {order.contact ? `${order.contact.firstName} ${order.contact.lastName}` : order.isGuest ? "Guest" : "Customer"}
            </span>
          </span>
        </button>
        <span className="text-[13px] text-ink-muted">{paymentMethodLabels[order.paymentMethod]}</span>
        <span className="w-24 text-right text-[16px] font-semibold text-ink">{formatPrice(order.subtotal)}</span>
        <OrderStatusSelect orderNumber={order.id} status={order.status} />
      </div>
      {isExpanded && (
        <div className="flex flex-col gap-6 border-t border-line-light p-5">
          <OrderCustomerDetails order={order} />
          <div className="border-t border-line-light pt-6">
            <OrderItemsList items={order.items} />
          </div>
        </div>
      )}
    </li>
  );
}
