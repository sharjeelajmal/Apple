"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import StatCard from "@/components/shared/dashboard/StatCard";

export default function WishlistStatCard() {
  const { wishlistItems } = useWishlist();

  return <StatCard icon={Heart} label="Saved items" value={String(wishlistItems.length)} href="/account/wishlist" />;
}
