"use client";

import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import CartNotices from "@/components/shared/CartNotices";
import { useRouter } from "next/navigation";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export default function CartClient() {
  const { cartItems, updateQuantity, removeFromCart, subtotal } = useCart();
  const [mounted, setMounted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 min-h-[70vh]">
      <CartNotices className="mb-8" />
      <AnimatePresence mode="wait">
        {cartItems.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center h-full pt-10"
          >
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
              <ShoppingBag size={48} />
            </div>
            <h1 className="text-[32px] md:text-[40px] font-semibold text-[#1d1d1f] tracking-tight text-center mb-4">
              Your bag is empty.
            </h1>
            <p className="text-gray-500 text-center mb-10 max-w-md text-[16px]">
              Free delivery and free returns on all orders.
            </p>
            <Button 
              href="/collections/all"
              className="px-8 py-4 font-medium rounded-full"
            >
              Continue Shopping
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="populated"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          >
            {/* Cart Items List */}
            <div className="lg:col-span-2">
              <h1 className="text-[32px] md:text-[40px] font-semibold text-[#1d1d1f] tracking-tight mb-10">
                Review your bag.
              </h1>
              <div className="flex flex-col gap-8">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      variants={itemVariants}
                      exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                      className="flex flex-col sm:flex-row gap-6 border-b border-[#d2d2d7] pb-8"
                    >
                      {/* Image */}
                      <div className="w-full sm:w-[150px] h-[150px] bg-[#f5f5f7] rounded-xl flex items-center justify-center p-4 relative shrink-0">
                        <img src={item.image.startsWith('//') ? `https:${item.image}` : item.image} alt={item.title} className="w-full h-full object-contain p-2" />
                      </div>

                      {/* Details & Controls */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-[24px] font-semibold text-[#1d1d1f] leading-tight mb-1">
                              {item.title}
                            </h3>
                            {item.variant && item.variant.colorName && (
                              <p className="text-[#6e6e73] text-[15px]">
                                {item.variant.storage} - {item.variant.colorName}
                              </p>
                            )}
                          </div>
                          <div className="text-[24px] font-semibold text-[#1d1d1f]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>

                        <div className="flex justify-between items-end mt-6">
                          {/* Quantity Control */}
                          <div className="flex items-center h-[36px] border border-[#d2d2d7] rounded-full overflow-hidden bg-white">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-[36px] h-full flex items-center justify-center text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <div className="w-[36px] h-full flex items-center justify-center text-[15px] font-medium text-[#1d1d1f] border-x border-[#d2d2d7]">
                              {item.quantity}
                            </div>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-[36px] h-full flex items-center justify-center text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          
                          {/* Remove */}
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#0071e3] hover:text-[#d3122a] transition-colors flex items-center gap-1 text-[14px]"
                          >
                            <Trash2 size={16} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Order Summary */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="bg-[#f5f5f7] rounded-2xl p-8 sticky top-[100px]">
                <h2 className="text-[24px] font-semibold text-[#1d1d1f] mb-6">Order Summary</h2>
                
                <div className="flex flex-col gap-4 text-[15px] border-b border-[#d2d2d7] pb-6 mb-6">
                  <div className="flex justify-between">
                    <span className="text-[#6e6e73]">Subtotal</span>
                    <span className="text-[#1d1d1f] font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6e6e73]">Shipping</span>
                    <span className="text-[#1d1d1f] font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6e6e73]">Estimated Tax</span>
                    <span className="text-[#1d1d1f] font-medium">Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-[20px] font-semibold text-[#1d1d1f]">Total</span>
                  <span className="text-[24px] font-semibold text-[#1d1d1f]">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex items-start gap-3 mb-6">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#0071e3] border-[#d2d2d7] rounded focus:ring-[#0071e3]"
                  />
                  <label htmlFor="terms" className="text-[14px] text-[#6e6e73]">
                    I agree with the terms and conditions
                  </label>
                </div>

                <Button 
                  onClick={() => router.push("/checkout")}
                  className="w-full h-[54px] text-[17px] font-medium rounded-full"
                  disabled={!termsAccepted}
                >
                  Check Out
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
