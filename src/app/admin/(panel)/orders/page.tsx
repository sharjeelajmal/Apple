import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminOrderRow from "@/components/admin/orders/AdminOrderRow";
import EmptyState from "@/components/shared/dashboard/EmptyState";
import { requireAdmin } from "@/lib/adminAuth";
import { getAllOrders } from "@/lib/adminStats";
import { orderStatusLabels, type OrderStatus } from "@/types/order";

const statusFilters = Object.entries(orderStatusLabels) as [OrderStatus, string][];

export default async function AdminOrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  await requireAdmin();
  const { status } = await searchParams;
  const activeStatus = statusFilters.find(([value]) => value === status)?.[0];
  const orders = await getAllOrders(activeStatus);

  const filterLinks = [["", "All"] as const, ...statusFilters];

  return (
    <>
      <AdminPageHeader title="Orders" description="Update an order's status and customers will see it in their account." />

      <nav aria-label="Filter orders" className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
        {filterLinks.map(([value, label]) => {
          const isActive = (activeStatus ?? "") === value;
          return (
            <Link
              key={label}
              href={value ? `/admin/orders?status=${value}` : "/admin/orders"}
              className={`shrink-0 rounded-full px-4 py-2 text-[14px] transition-colors ${
                isActive ? "bg-ink text-white" : "border border-line bg-surface text-ink hover:border-ink"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {orders.length ? (
        <ul className="flex flex-col gap-3">
          {orders.map((order) => (
            <AdminOrderRow key={order.id} order={order} />
          ))}
        </ul>
      ) : (
        <EmptyState icon={ShoppingBag} title="No orders found." description="Orders matching this filter will appear here." />
      )}
    </>
  );
}
