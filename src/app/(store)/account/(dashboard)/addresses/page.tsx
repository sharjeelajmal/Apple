import type { Metadata } from "next";
import AccountPageHeader from "@/components/pages/Account/AccountPageHeader";
import AddressBook from "@/components/pages/Account/AddressBook";
import { getAddressesForUser } from "@/lib/addresses";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Your Addresses | Apple",
};

export default async function AddressesPage() {
  const { user } = await requireSession();
  const addresses = await getAddressesForUser(user.id);

  return (
    <>
      <AccountPageHeader title="Addresses" description="Manage where your orders are delivered." />
      <AddressBook addresses={addresses} />
    </>
  );
}
