import type { Metadata } from "next";
import AccountPageHeader from "@/components/pages/Account/AccountPageHeader";
import WishlistPanel from "@/components/pages/Account/WishlistPanel";

export const metadata: Metadata = {
  title: "Your Wishlist | Apple",
};

export default function AccountWishlistPage() {
  return (
    <>
      <AccountPageHeader title="Wishlist" description="The products you've saved for later." />
      <WishlistPanel />
    </>
  );
}
