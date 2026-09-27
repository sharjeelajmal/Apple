"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/components/shared/ProductCard";
import { authClient } from "@/lib/authClient";
import { getSavedWishlist, saveWishlist } from "@/actions/wishlistActions";

type FlyingItem = {
  id: string;
  image: string;
  startRect: DOMRect;
};

type WishlistContextType = {
  wishlistItems: Product[];
  addToWishlist: (product: Product, startRect: DOMRect) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
};

const mergeById = (first: Product[], second: Product[]) => [
  ...new Map([...first, ...second].map((item) => [item.id, item])).values(),
];

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem("apple_wishlist");
      if (saved) {
        setWishlistItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load wishlist", e);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("apple_wishlist", JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isClient]);

  const { data: session } = authClient.useSession();
  const userId = session?.user.id;
  const syncedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!userId || !isClient || syncedUserId.current === userId) return;

    getSavedWishlist().then((savedItems) => {
      syncedUserId.current = userId;
      setWishlistItems((localItems) => mergeById(savedItems, localItems));
    });
  }, [userId, isClient]);

  useEffect(() => {
    if (userId && syncedUserId.current === userId) {
      saveWishlist(wishlistItems);
    }
  }, [wishlistItems, userId]);

  const clearWishlist = () => {
    syncedUserId.current = null;
    setWishlistItems([]);
  };

  const addToWishlist = (product: Product, startRect: DOMRect) => {
    // If already in wishlist, remove it (toggle behavior)
    if (wishlistItems.some((item) => item.id === product.id)) {
      removeFromWishlist(product.id);
      return;
    }

    // Add to wishlist state
    setWishlistItems((prev) => [...prev, product]);

    // Trigger fly animation
    const flyingId = Date.now().toString();
    setFlyingItems((prev) => [
      ...prev,
      { id: flyingId, image: product.image, startRect },
    ]);

    // Remove flying item after animation completes
    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((item) => item.id !== flyingId));
      
      // Dispatch custom event to trigger badge bounce on Header
      window.dispatchEvent(new Event('wishlist-updated'));
    }, 1000);
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist }}>
      {children}
      
      {/* Global Flying Animation Layer */}
      {isClient && (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
          <AnimatePresence>
            {flyingItems.map((item) => {
              // Try to find the target icon rect
              const targetEl = document.getElementById("header-wishlist-icon");
              let targetRect = { top: 20, left: window.innerWidth - 100, width: 24, height: 24 };
              if (targetEl) {
                targetRect = targetEl.getBoundingClientRect();
              }

              // Calculate start and end positions relative to viewport
              const startX = item.startRect.left + item.startRect.width / 2;
              const startY = item.startRect.top + item.startRect.height / 2;
              const endX = targetRect.left + targetRect.width / 2;
              const endY = targetRect.top + targetRect.height / 2;
              
              // Width of the flying image
              const size = 60;

              return (
                <motion.div
                  key={item.id}
                  initial={{ 
                    opacity: 1, 
                    x: startX - size/2, 
                    y: startY - size/2,
                    scale: 1,
                    rotate: 0 
                  }}
                  animate={{ 
                    opacity: [1, 1, 0],
                    x: endX - size/2,
                    y: endY - size/2,
                    scale: [1, 0.8, 0.1],
                    rotate: [0, 15, 45]
                  }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="absolute w-[60px] h-[60px] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden flex items-center justify-center p-1"
                >
                  <Image 
                    src={item.image} 
                    alt="Flying product" 
                    fill 
                    className="object-contain p-1"
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </WishlistContext.Provider>
  );
};
