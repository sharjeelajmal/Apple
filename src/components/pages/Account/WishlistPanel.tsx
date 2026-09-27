"use client";

import Link from "next/link";
import { Heart, X } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice, resolveImageUrl } from "@/lib/format";
import EmptyState from "@/components/shared/dashboard/EmptyState";

export default function WishlistPanel() {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  if (!wishlistItems.length) {
    return (
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty."
        description="Tap the heart on any product to save it here for later."
        actionLabel="Explore Products"
        actionHref="/collections/all"
      />
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {wishlistItems.map((product) => (
        <li
          key={product.id}
          className="group relative rounded-card border border-line-light bg-surface p-4 shadow-soft"
        >
          <button
            type="button"
            aria-label={`Remove ${product.title} from wishlist`}
            onClick={() => removeFromWishlist(product.id)}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface-muted text-ink-muted transition-colors hover:bg-ink hover:text-white"
          >
            <X size={16} />
          </button>
          <Link href={`/products/${product.handle}`} className="block">
            <div className="flex aspect-square items-center justify-center rounded-field bg-surface-muted p-4">
              <img
                src={resolveImageUrl(product.image)}
                alt={product.title}
                className="h-full w-full object-contain transition-transform duration-500 ease-smooth group-hover:scale-105"
              />
            </div>
            <h3 className="mt-4 line-clamp-2 text-[15px] font-semibold text-ink">{product.title}</h3>
            <p className="mt-1 text-[14px] text-ink-muted">{formatPrice(product.price)}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
