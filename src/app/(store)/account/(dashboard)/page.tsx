import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, MapPin, Package } from "lucide-react";
import AccountPageHeader from "@/components/pages/Account/AccountPageHeader";
import OrderList from "@/components/pages/Account/OrderList";
import SectionCard from "@/components/shared/dashboard/SectionCard";
import StatCard from "@/components/shared/dashboard/StatCard";
import WishlistStatCard from "@/components/pages/Account/WishlistStatCard";
import ForYouSection from "@/components/ai/ForYouSection";
import { assistantConfig } from "@/config/env";
import { getAddressesForUser } from "@/lib/addresses";
import { formatPrice } from "@/lib/format";
import { getOrdersForUser } from "@/lib/orders";
import { requireSession } from "@/lib/session";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Your Account | ${siteConfig.name}`,
};

const RECENT_ORDERS_LIMIT = 3;

export default async function AccountOverviewPage() {
  const { user } = await requireSession();
  const [orders, addresses] = await Promise.all([
    getOrdersForUser(user.id),
    getAddressesForUser(user.id),
  ]);

  const totalSpent = orders.reduce((total, order) => total + order.subtotal, 0);
  const defaultAddress = addresses.find((address) => address.isDefault);

  return (
    <div className="flex flex-col gap-8">
      <AccountPageHeader title="Overview" description="Everything about your account, all in one place." />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard icon={Package} label="Orders" value={String(orders.length)} href="/account/orders" />
        <StatCard icon={CreditCard} label="Total spent" value={formatPrice(totalSpent)} href="/account/orders" />
        <WishlistStatCard />
        <StatCard icon={MapPin} label="Saved addresses" value={String(addresses.length)} href="/account/addresses" />
      </div>

      {assistantConfig.isEnabled && <ForYouSection variant="account" />}

      <SectionCard
        title="Recent Orders"
        action={
          orders.length > RECENT_ORDERS_LIMIT && (
            <Link href="/account/orders" className="text-[14px] text-hyperlink hover:underline">
              View all
            </Link>
          )
        }
      >
        <OrderList orders={orders.slice(0, RECENT_ORDERS_LIMIT)} />
      </SectionCard>

      <SectionCard
        title="Default Shipping Address"
        action={
          <Link href="/account/addresses" className="text-[14px] text-hyperlink hover:underline">
            Manage
          </Link>
        }
      >
        {defaultAddress ? (
          <address className="text-[15px] not-italic leading-relaxed text-ink-muted">
            <span className="block font-medium text-ink">{defaultAddress.fullName}</span>
            {defaultAddress.street}, {defaultAddress.city} {defaultAddress.postalCode}
          </address>
        ) : (
          <p className="text-[15px] text-ink-muted">You haven&apos;t added a shipping address yet.</p>
        )}
      </SectionCard>
    </div>
  );
}
