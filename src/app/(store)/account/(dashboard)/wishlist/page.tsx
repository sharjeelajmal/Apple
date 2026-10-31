import type { Metadata } from "next";
import AccountPageHeader from "@/components/pages/Account/AccountPageHeader";
import WishlistPanel from "@/components/pages/Account/WishlistPanel";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Your Wishlist | ${siteConfig.name}`,
};

export default function AccountWishlistPage() {
  return (
    <>
      <AccountPageHeader title="Wishlist" description="The products you've saved for later." />
      <WishlistPanel />
    </>
  );
}
