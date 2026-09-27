import Link from "next/link";
import { getCategoryName } from "@/config/categories";
import { LOW_STOCK_THRESHOLD } from "@/config/inventory";
import { formatPrice } from "@/lib/format";
import type { CatalogProduct } from "@/types/catalog";

interface ProductTableProps {
  products: (CatalogProduct & { stock: number; startingPrice: number })[];
}

const stockStyle = (stock: number) => {
  if (stock === 0) return "text-danger";
  if (stock <= LOW_STOCK_THRESHOLD) return "text-amber-600";
  return "text-ink";
};

export default function ProductTable({ products }: ProductTableProps) {
  return (
    <div className="overflow-x-auto rounded-card border border-line-light bg-surface shadow-soft">
      <table className="w-full min-w-[720px] text-left text-[14px]">
        <thead className="border-b border-line-light text-[12px] uppercase tracking-wider text-ink-subtle">
          <tr>
            <th className="px-5 py-3 font-medium">Product</th>
            <th className="px-5 py-3 font-medium">Category</th>
            <th className="px-5 py-3 font-medium">Price</th>
            <th className="px-5 py-3 font-medium">Stock</th>
            <th className="px-5 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line-light">
          {products.map((product) => (
            <tr key={product.id} className="transition-colors hover:bg-surface-muted">
              <td className="px-5 py-3">
                <Link href={`/admin/inventory/${product.id}`} className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-surface-muted">
                    {product.images[0] && <img src={product.images[0]} alt="" className="h-full w-full object-contain p-1" />}
                  </span>
                  <span>
                    <span className="block font-semibold text-ink hover:text-accent">{product.title}</span>
                    <span className="block text-[12px] text-ink-subtle">
                      {product.variants.length} {product.variants.length === 1 ? "variant" : "variants"}
                    </span>
                  </span>
                </Link>
              </td>
              <td className="px-5 py-3 text-ink-muted">{getCategoryName(product.category)}</td>
              <td className="px-5 py-3 text-ink">{formatPrice(product.startingPrice)}</td>
              <td className={`px-5 py-3 font-medium ${stockStyle(product.stock)}`}>
                {product.stock === 0 ? "Out of stock" : product.stock}
              </td>
              <td className="px-5 py-3">
                <span
                  className={`rounded-full px-3 py-1 text-[12px] font-semibold ${
                    product.status === "active" ? "bg-positive/15 text-green-700" : "bg-line-light text-ink-muted"
                  }`}
                >
                  {product.status === "active" ? "Active" : "Draft"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
