import type { Metadata } from "next";
import AccountPageHeader from "@/components/pages/Account/AccountPageHeader";
import OrderList from "@/components/pages/Account/OrderList";
import { getOrdersForUser } from "@/lib/orders";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Your Orders | Apple",
};

export default async function OrdersPage() {
  const { user } = await requireSession();
  const orders = await getOrdersForUser(user.id);

  return (
    <>
      <AccountPageHeader title="Orders" description="Track, review, and manage everything you've ordered." />
      <OrderList orders={orders} expandFirst />
    </>
  );
}
