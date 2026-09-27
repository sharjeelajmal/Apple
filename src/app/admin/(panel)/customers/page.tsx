import Link from "next/link";
import { ChevronRight, Users } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmptyState from "@/components/shared/dashboard/EmptyState";
import UserAvatar from "@/components/shared/UserAvatar";
import { requireAdmin } from "@/lib/adminAuth";
import { getCustomers } from "@/lib/adminCustomers";
import { formatLongDate, formatPrice } from "@/lib/format";

export default async function CustomersPage() {
  await requireAdmin();
  const customers = await getCustomers();
  const guestCount = customers.filter((customer) => customer.isGuest).length;

  return (
    <>
      <AdminPageHeader
        title="Customers"
        description={`${customers.length - guestCount} registered · ${guestCount} guest ${guestCount === 1 ? "customer" : "customers"}. Select a customer to see their orders, cards and addresses.`}
      />

      {customers.length ? (
        <div className="overflow-x-auto rounded-card border border-line-light bg-surface shadow-soft">
          <table className="w-full min-w-[760px] text-left text-[14px]">
            <thead className="border-b border-line-light text-[12px] uppercase tracking-wider text-ink-subtle">
              <tr>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium">Orders</th>
                <th className="px-5 py-3 font-medium">Last order</th>
                <th className="px-5 py-3 font-medium">Total spent</th>
                <th className="w-10 px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line-light">
              {customers.map((customer) => {
                const href = `/admin/customers/${encodeURIComponent(customer.email)}`;
                return (
                  <tr key={customer.email} className="transition-colors hover:bg-surface-muted">
                    <td className="px-5 py-3">
                      <Link href={href} className="flex items-center gap-3">
                        <UserAvatar name={customer.name} className="h-10 w-10 text-[14px]" />
                        <span>
                          <span className="flex items-center gap-2 font-semibold text-ink">
                            {customer.name}
                            {customer.isGuest && (
                              <span className="rounded-full bg-line-light px-2 py-0.5 text-[11px] font-medium text-ink-muted">Guest</span>
                            )}
                          </span>
                          <span className="block text-[13px] text-ink-muted">{customer.email}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-ink-muted">{customer.joinedAt ? formatLongDate(customer.joinedAt) : "—"}</td>
                    <td className="px-5 py-3 text-ink">{customer.orderCount}</td>
                    <td className="px-5 py-3 text-ink-muted">{customer.lastOrderAt ? formatLongDate(customer.lastOrderAt) : "—"}</td>
                    <td className="px-5 py-3 font-medium text-ink">{formatPrice(customer.totalSpent)}</td>
                    <td className="px-5 py-3">
                      <Link href={href} aria-label={`View ${customer.name}`} className="text-ink-subtle hover:text-ink">
                        <ChevronRight size={18} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon={Users} title="No customers yet." description="Customers appear here after they sign up or place an order." />
      )}
    </>
  );
}
