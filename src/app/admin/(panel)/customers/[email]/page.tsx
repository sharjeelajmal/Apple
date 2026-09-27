import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, CreditCard, MapPin, ShoppingBag } from "lucide-react";
import AddressBlock from "@/components/admin/customers/AddressBlock";
import PaymentCardTile from "@/components/admin/customers/PaymentCardTile";
import AdminOrderRow from "@/components/admin/orders/AdminOrderRow";
import EmptyState from "@/components/shared/dashboard/EmptyState";
import SectionCard from "@/components/shared/dashboard/SectionCard";
import UserAvatar from "@/components/shared/UserAvatar";
import { requireAdmin } from "@/lib/adminAuth";
import { getCustomerDetail } from "@/lib/adminCustomers";
import { formatLongDate, formatPrice } from "@/lib/format";

export default async function CustomerDetailPage({ params }: PageProps<"/admin/customers/[email]">) {
  await requireAdmin();
  const { email } = await params;
  const customer = await getCustomerDetail(decodeURIComponent(email));

  if (!customer) {
    notFound();
  }

  const stats = [
    { label: "Orders", value: String(customer.orderCount) },
    { label: "Total spent", value: formatPrice(customer.totalSpent) },
    { label: customer.isGuest ? "Account" : "Customer since", value: customer.joinedAt ? formatLongDate(customer.joinedAt) : "Guest checkout" },
  ];

  return (
    <>
      <Link href="/admin/customers" className="mb-4 inline-flex items-center gap-1 text-[14px] text-hyperlink hover:underline">
        <ChevronLeft size={16} />
        Customers
      </Link>

      <header className="mb-8 flex flex-wrap items-center gap-5">
        <UserAvatar name={customer.name} className="h-16 w-16 text-[22px]" />
        <div className="min-w-0 flex-1">
          <h1 className="flex flex-wrap items-center gap-3 text-[28px] font-semibold tracking-tight text-ink md:text-[34px]">
            {customer.name}
            {customer.isGuest && (
              <span className="rounded-full bg-line-light px-3 py-1 text-[13px] font-medium text-ink-muted">Guest</span>
            )}
          </h1>
          <p className="text-[15px] text-ink-muted">
            <a href={`mailto:${customer.email}`} className="hover:text-accent">
              {customer.email}
            </a>
            {customer.phone && (
              <>
                {" · "}
                <a href={`tel:${customer.phone}`} className="hover:text-accent">
                  {customer.phone}
                </a>
              </>
            )}
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-8">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map(({ label, value }) => (
            <div key={label} className="rounded-card border border-line-light bg-surface p-5 shadow-soft">
              <dt className="text-[14px] text-ink-muted">{label}</dt>
              <dd className="mt-1 text-[24px] font-semibold tracking-tight text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <SectionCard title="Payment cards" description="Cards used at checkout.">
          {customer.cards.length ? (
            <div className="grid gap-8 md:grid-cols-2 2xl:grid-cols-3">
              {customer.cards.map((card) => (
                <PaymentCardTile
                  key={`${card.brand}-${card.cardNumber || card.last4}-${card.expiry}`}
                  card={card}
                  footer={
                    <div className="flex flex-col gap-3 text-[14px]">
                      <p className="text-ink-muted">
                        Used for {card.orderCount} {card.orderCount === 1 ? "order" : "orders"} · last on {formatLongDate(card.lastUsedAt)}
                      </p>
                      {card.billingAddress && (
                        <div>
                          <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-ink-subtle">Billing address</p>
                          <AddressBlock address={card.billingAddress} />
                        </div>
                      )}
                    </div>
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState icon={CreditCard} title="No cards on file." description="This customer hasn't paid by card yet." />
          )}
        </SectionCard>

        <SectionCard title="Addresses">
          {customer.addresses.length ? (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {customer.addresses.map((address) => (
                <li key={`${address.street}-${address.postalCode}`} className="rounded-[14px] border border-line-light p-4">
                  <AddressBlock address={address} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={MapPin} title="No addresses yet." description="Addresses appear after the customer checks out." />
          )}
        </SectionCard>

        <SectionCard title="Order history" description="Every order this customer has placed, newest first.">
          {customer.orders.length ? (
            <ul className="flex flex-col gap-3">
              {customer.orders.map((order) => (
                <AdminOrderRow key={order.id} order={order} />
              ))}
            </ul>
          ) : (
            <EmptyState icon={ShoppingBag} title="No orders yet." description="This customer hasn't placed an order." />
          )}
        </SectionCard>
      </div>
    </>
  );
}
