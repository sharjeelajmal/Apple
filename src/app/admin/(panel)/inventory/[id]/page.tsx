import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ProductForm from "@/components/admin/inventory/ProductForm";
import { requireAdmin } from "@/lib/adminAuth";
import { getProductById } from "@/lib/catalog";
import { formatLongDate } from "@/lib/format";

export default async function EditProductPage({ params }: PageProps<"/admin/inventory/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Link href="/admin/inventory" className="mb-4 inline-flex items-center gap-1 text-[14px] text-hyperlink hover:underline">
        <ChevronLeft size={16} />
        Inventory
      </Link>
      <AdminPageHeader title={product.title} description={`Last updated ${formatLongDate(product.updatedAt)}`} />
      <ProductForm product={product} />
    </>
  );
}
