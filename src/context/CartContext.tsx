"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { syncCartItems } from "@/actions/cartActions";

export type CartItem = {
  id: string; // unique ID usually combination of product ID + variant details
  productId: string;
  title: string;
  handle: string;
  price: number;
  image: string;
  quantity: number;
  variant?: {
    storage?: string;
    colorHex?: string;
    colorName?: string;
  };
};

type FlyingItem = {
  id: string;
  image: string;
  startRect: DOMRect;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>, startRect: DOMRect) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartNotices: string[];
  dismissCartNotices: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [cartNotices, setCartNotices] = useState<string[]>([]);

  // Load from local storage
  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem("apple_cart");
      if (saved) {
        const savedItems: CartItem[] = JSON.parse(saved);
        const savedIds = new Set(savedItems.map((item) => item.id));
        setCartItems(savedItems);

        syncCartItems(savedItems).then(({ items, notices }) => {
          setCartItems((current) => [...items, ...current.filter((item) => !savedIds.has(item.id))]);
          setCartNotices(notices);
        });
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("apple_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isClient]);

  const addToCart = (item: Omit<CartItem, 'id'>, startRect: DOMRect) => {
    // Generate unique ID based on product and variant
    const variantStr = item.variant ? `${item.variant.storage}-${item.variant.colorHex}` : 'default';
    const cartItemId = `${item.productId}-${variantStr}`;

    setCartItems((prev) => {
      const existing = prev.find(i => i.id === cartItemId);
      if (existing) {
        return prev.map(i => i.id === cartItemId ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, { ...item, id: cartItemId }];
    });

    // Trigger fly animation
    const flyingId = Date.now().toString();
    setFlyingItems((prev) => [
      ...prev,
      { id: flyingId, image: item.image, startRect },
    ]);

    // Cleanup animation and bounce header
    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((item) => item.id !== flyingId));
      window.dispatchEvent(new Event('cart-updated'));
    }, 1000);
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems((prev) => prev.map(i => i.id === cartItemId ? { ...i, quantity } : i));
  };

  const clearCart = () => setCartItems([]);

  const dismissCartNotices = () => setCartNotices([]);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartNotices, dismissCartNotices, totalItems, subtotal }}>
      {children}
      
      {/* Global Flying Animation Layer for Cart */}
      {isClient && (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
          <AnimatePresence>
            {flyingItems.map((item) => {
              const targetEl = document.getElementById("header-cart-icon");
              let targetRect = { top: 20, left: window.innerWidth - 60, width: 24, height: 24 };
              if (targetEl) {
                targetRect = targetEl.getBoundingClientRect();
              }

              const startX = item.startRect.left + item.startRect.width / 2;
              const startY = item.startRect.top + item.startRect.height / 2;
              const endX = targetRect.left + targetRect.width / 2;
              const endY = targetRect.top + targetRect.height / 2;
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
                    rotate: [0, -15, -45] // Rotate opposite to wishlist for visual variety
                  }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="absolute w-[60px] h-[60px] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden flex items-center justify-center p-1"
                >
                  <img 
                    src={item.image.startsWith('//') ? `https:${item.image}` : item.image} 
                    alt="Flying product" 
                    className="w-full h-full object-contain p-1"
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </CartContext.Provider>
  );
};
