"use client";

import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/shared/ProductCard";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { HeartCrack } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export default function WishlistClient() {
  const { wishlistItems } = useWishlist();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by rendering only after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 min-h-[60vh]">
      <AnimatePresence mode="wait">
        {wishlistItems.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center h-full pt-10"
          >
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <HeartCrack size={48} className="text-gray-400" />
            </div>
            <h1 className="text-[32px] md:text-[40px] font-semibold text-[#1d1d1f] tracking-tight text-center mb-4">
              Your wishlist is empty.
            </h1>
            <p className="text-gray-500 text-center mb-10 max-w-md text-[16px]">
              Explore our products and tap the heart icon to save your favorite items here for later.
            </p>
            <Link 
              href="/"
              className="px-8 py-4 bg-[#0071e3] text-white font-medium rounded-full hover:bg-[#0077ED] transition-colors"
            >
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="populated"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
              <h1 className="text-[32px] md:text-[40px] font-semibold text-[#1d1d1f] tracking-tight">
                Your Wishlist <span className="text-gray-400 text-[24px]">({wishlistItems.length})</span>
              </h1>
              {/* Optional: A clear all button could go here if requested, but individual removes usually suffice for premium feel */}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence>
                {wishlistItems.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    variants={itemVariants}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
