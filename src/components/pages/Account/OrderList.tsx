import { Package } from "lucide-react";
import type { Order } from "@/types/order";
import EmptyState from "@/components/shared/dashboard/EmptyState";
import OrderCard from "./OrderCard";

interface OrderListProps {
  orders: Order[];
  expandFirst?: boolean;
}

export default function OrderList({ orders, expandFirst = false }: OrderListProps) {
  if (!orders.length) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet."
        description="When you place an order, you can track it right here."
        actionLabel="Start Shopping"
        actionHref="/collections/all"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order, index) => (
        <OrderCard key={order.id} order={order} defaultExpanded={expandFirst && index === 0} />
      ))}
    </div>
  );
}
