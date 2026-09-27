import { orderStatusLabels, type OrderStatus } from "@/types/order";

export const orderStatusStyles: Record<OrderStatus, string> = {
  placed: "bg-accent/10 text-accent",
  processing: "bg-amber-100 text-amber-700",
  shipped: "bg-violet-100 text-violet-700",
  delivered: "bg-positive/15 text-green-700",
  cancelled: "bg-danger-soft text-danger",
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-semibold ${orderStatusStyles[status]}`}>
      {orderStatusLabels[status]}
    </span>
  );
}
