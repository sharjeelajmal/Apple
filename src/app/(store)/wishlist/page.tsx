import { Metadata } from "next";
import Breadcrumb from "@/components/pages/Product/Breadcrumb";
import WishlistClient from "@/components/pages/Wishlist/WishlistClient";

export const metadata: Metadata = {
  title: "Your Wishlist | Apple Store",
  description: "View and manage your saved products.",
};

export default function WishlistPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Wishlist" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-[70px]"> {/* Offset for fixed header */}
        <Breadcrumb items={breadcrumbs} />
        <WishlistClient />
      </main>
    </div>
  );
}
