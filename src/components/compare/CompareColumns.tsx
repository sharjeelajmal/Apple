import Image from "next/image";
import Link from "next/link";
import { getStartingPrice } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import type { CatalogProduct } from "@/types/catalog";

export default function CompareColumns({ products }: { products: CatalogProduct[] }) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))` }}>
      {products.map((product) => (
        <div key={product.id} className="flex flex-col items-center rounded-card bg-surface p-4 text-center shadow-subtle md:p-6">
          <div className="relative h-32 w-full md:h-44">
            <Image src={product.images[0]} alt={product.title} fill sizes="(min-width: 768px) 300px, 33vw" className="object-contain" />
          </div>
          <h2 className="mt-4 text-[15px] font-semibold text-ink md:text-[19px]">{product.title}</h2>
          <p className="mt-1 text-[14px] text-ink-muted">From {formatPrice(getStartingPrice(product))}</p>
          <Link
            href={`/products/${product.handle}`}
            className="mt-4 rounded-full bg-accent px-4 py-2 text-[13px] font-medium text-white hover:bg-accent-hover md:px-5 md:text-[14px]"
          >
            View & buy
          </Link>
        </div>
      ))}
    </div>
  );
}
