import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ProductForm from "@/components/admin/inventory/ProductForm";
import { requireAdmin } from "@/lib/adminAuth";

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <>
      <Link href="/admin/inventory" className="mb-4 inline-flex items-center gap-1 text-[14px] text-hyperlink hover:underline">
        <ChevronLeft size={16} />
        Inventory
      </Link>
      <AdminPageHeader title="Add Product" description="Create a new product for your store." />
      <ProductForm />
    </>
  );
}
