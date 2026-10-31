"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import type { ProductCardData } from "@/types/catalog";

const ADDED_FEEDBACK_MS = 1800;

type AssistantProductCardProps = {
  product: ProductCardData;
  onNavigate: () => void;
};

export default function AssistantProductCard({ product, onNavigate }: AssistantProductCardProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (event: MouseEvent<HTMLButtonElement>) => {
    addToCart(
      {
        productId: product.id,
        title: product.title,
        handle: product.handle,
        price: product.price,
        image: product.image,
        quantity: 1,
      },
      event.currentTarget.getBoundingClientRect()
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), ADDED_FEEDBACK_MS);
  };

  return (
    <div className="flex items-center gap-3 rounded-field bg-white p-2.5 shadow-subtle">
      <Link href={`/products/${product.handle}`} onClick={onNavigate} className="flex min-w-0 flex-1 items-center gap-3">
        <span className="relative h-12 w-12 shrink-0">
          <Image src={product.image} alt={product.title} fill sizes="48px" className="object-contain" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[14px] font-medium text-ink hover:text-accent">{product.title}</span>
          <span className="text-[13px] text-ink-muted">
            {product.isSoldOut ? "Sold out" : `From ${formatPrice(product.price)}`}
          </span>
        </span>
      </Link>
      {!product.isSoldOut && (
        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Add ${product.title} to bag`}
          className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium transition-colors ${
            isAdded ? "bg-positive text-white" : "bg-surface-muted text-ink hover:bg-ink hover:text-white"
          }`}
        >
          {isAdded ? <Check size={15} /> : <ShoppingBag size={15} />}
          {isAdded ? "Added" : "Add"}
        </button>
      )}
    </div>
  );
}
