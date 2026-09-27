import { Metadata } from "next";
import Breadcrumb from "@/components/pages/Product/Breadcrumb";
import CartClient from "@/components/pages/Cart/CartClient";

export const metadata: Metadata = {
  title: "Your Bag | Apple Store",
  description: "Review your selected items and checkout securely.",
};

export default function CartPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Cart" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-[70px]">
        <Breadcrumb items={breadcrumbs} />
        <CartClient />
      </main>
    </div>
  );
}
