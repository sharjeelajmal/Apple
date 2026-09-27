import Link from "next/link";
import { AlertTriangle, DollarSign, Mail, Package, ShoppingBag, Users } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ImportCatalogButton from "@/components/admin/ImportCatalogButton";
import OrderStatusBadge from "@/components/shared/order/OrderStatusBadge";
import EmptyState from "@/components/shared/dashboard/EmptyState";
import SectionCard from "@/components/shared/dashboard/SectionCard";
import StatCard from "@/components/shared/dashboard/StatCard";
import { requireAdmin } from "@/lib/adminAuth";
import { getDashboardStats } from "@/lib/adminStats";
import { formatDate, formatPrice } from "@/lib/format";

export default async function AdminOverviewPage() {
  await requireAdmin();
  const stats = await getDashboardStats();

  const statCards = [
    { icon: DollarSign, label: "Revenue", value: formatPrice(stats.revenue), href: "/admin/orders" },
    { icon: ShoppingBag, label: "Orders", value: String(stats.orderCount), href: "/admin/orders" },
    { icon: Users, label: "Customers", value: String(stats.customerCount), href: "/admin/customers" },
    { icon: Package, label: "Products", value: String(stats.productCount), href: "/admin/inventory" },
    { icon: AlertTriangle, label: "Low stock products", value: String(stats.lowStockCount), href: "/admin/inventory" },
    { icon: Mail, label: "New messages", value: String(stats.newMessageCount), href: "/admin/messages" },
  ];

  return (
    <>
      <AdminPageHeader title="Overview" description="A quick look at how your store is doing." />

      <div className="flex flex-col gap-8">
        {stats.productCount === 0 && (
          <SectionCard
            title="Your inventory is empty"
            description="Import the products currently shown on the storefront to get started. You can edit or delete them anytime."
          >
            <ImportCatalogButton />
          </SectionCard>
        )}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        <SectionCard
          title="Recent Orders"
          action={
            <Link href="/admin/orders" className="text-[14px] text-hyperlink hover:underline">
              View all
            </Link>
          }
        >
          {stats.recentOrders.length ? (
            <ul className="divide-y divide-line-light">
              {stats.recentOrders.map((order) => (
                <li key={order.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-4 first:pt-0 last:pb-0">
                  <span className="text-[15px] font-semibold text-ink">{order.id}</span>
                  <span className="flex-1 text-[14px] text-ink-muted">{formatDate(order.placedAt, { year: "numeric" })}</span>
                  <OrderStatusBadge status={order.status} />
                  <span className="w-24 text-right text-[15px] font-semibold text-ink">{formatPrice(order.subtotal)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={ShoppingBag} title="No orders yet." description="New orders will appear here as soon as they're placed." />
          )}
        </SectionCard>
      </div>
    </>
  );
}
