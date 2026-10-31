"use client";

import { useTransition } from "react";
import CustomDropdown from "@/components/shared/CustomDropdown";
import { updateOrderStatus } from "@/actions/admin/orderActions";
import { orderStatusStyles } from "@/components/shared/order/OrderStatusBadge";
import { orderStatusLabels, type OrderStatus } from "@/types/order";

const statusOptions = (Object.entries(orderStatusLabels) as [OrderStatus, string][]).map(([value, label]) => ({
  value,
  label,
}));

interface OrderStatusSelectProps {
  orderNumber: string;
  status: OrderStatus;
}

export default function OrderStatusSelect({ orderNumber, status }: OrderStatusSelectProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <CustomDropdown
      options={statusOptions}
      value={status}
      disabled={isPending || status === "cancelled"}
      ariaLabel={`Status for order ${orderNumber}`}
      onChange={(nextStatus) => startTransition(() => updateOrderStatus(orderNumber, nextStatus as OrderStatus))}
      buttonClassName={`flex h-9 min-w-[140px] items-center justify-between gap-2 rounded-full px-3.5 text-[13px] font-semibold outline-none transition-opacity focus:ring-4 focus:ring-accent/15 disabled:opacity-60 ${orderStatusStyles[status]}`}
    />
  );
}
