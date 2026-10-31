"use client";

import { Fragment, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import type { BundleProduct } from "@/types/catalog";

type FrequentlyBoughtTogetherProps = {
  currentProduct: BundleProduct;
  suggestions: BundleProduct[];
};

const ADDED_FEEDBACK_MS = 2000;

export default function FrequentlyBoughtTogether({ currentProduct, suggestions }: FrequentlyBoughtTogetherProps) {
  const { addToCart } = useCart();
  const bundle = [currentProduct, ...suggestions];
  const [selectedIds, setSelectedIds] = useState(() => new Set(bundle.map((product) => product.id)));
  const [isAdded, setIsAdded] = useState(false);

  if (!suggestions.length || !currentProduct.variant) return null;

  const selectedProducts = bundle.filter((product) => selectedIds.has(product.id));
  const total = selectedProducts.reduce((sum, product) => sum + product.price, 0);

  const toggleProduct = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddAll = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    selectedProducts.forEach((product) =>
      addToCart(
        {
          productId: product.id,
          title: product.title,
          handle: product.handle,
          price: product.price,
          image: product.image,
          quantity: 1,
          variant: product.variant ?? undefined,
        },
        rect
      )
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), ADDED_FEEDBACK_MS);
  };

  return (
    <section aria-labelledby="bought-together-title" className="mx-auto mt-16 max-w-[1200px] px-4 sm:px-6 md:mt-24 lg:px-8">
      <div className="rounded-card bg-surface-muted p-6 md:p-10">
        <h2 id="bought-together-title" className="text-[24px] font-semibold tracking-tight text-ink md:text-[32px]">
          Frequently bought together
        </h2>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3 md:gap-5">
            {bundle.map((product, index) => (
              <Fragment key={product.id}>
                {index > 0 && <Plus size={20} className="shrink-0 text-ink-subtle" />}
                <Link
                  href={`/products/${product.handle}`}
                  className={`relative h-24 w-24 overflow-hidden rounded-field bg-white shadow-subtle transition-opacity md:h-32 md:w-32 ${
                    selectedIds.has(product.id) ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <Image src={product.image} alt={product.title} fill sizes="128px" className="object-contain p-3" />
                </Link>
              </Fragment>
            ))}
          </div>

          <div className="flex shrink-0 flex-col gap-3 lg:items-end">
            <p className="text-[15px] text-ink-muted">
              Total for {selectedProducts.length} {selectedProducts.length === 1 ? "item" : "items"}:{" "}
              <span className="text-[21px] font-semibold text-ink">{formatPrice(total)}</span>
            </p>
            <button
              type="button"
              onClick={handleAddAll}
              disabled={!selectedProducts.length}
              className="flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 text-[15px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              {isAdded && <Check size={18} />}
              {isAdded ? "Added to bag" : selectedProducts.length === bundle.length ? "Add all to bag" : "Add selected to bag"}
            </button>
          </div>
        </div>

        <ul className="mt-8 flex flex-col gap-3 border-t border-line pt-6">
          {bundle.map((product, index) => (
            <li key={product.id}>
              <label className="flex cursor-pointer items-start gap-3 text-[15px]">
                <input
                  type="checkbox"
                  checked={selectedIds.has(product.id)}
                  onChange={() => toggleProduct(product.id)}
                  className="mt-1 h-4 w-4 shrink-0 accent-accent"
                />
                <span className="text-ink">
                  {index === 0 && <span className="font-semibold">This item: </span>}
                  {product.title}
                  {product.variantLabel && <span className="text-ink-muted"> ({product.variantLabel})</span>}
                  <span className="ml-2 font-semibold">{formatPrice(product.price)}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
