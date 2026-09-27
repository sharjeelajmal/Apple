"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import useIsClient from "@/hooks/useIsClient";
import CartNotices from "@/components/shared/CartNotices";
import CheckoutEmptyBag from "./CheckoutEmptyBag";
import CheckoutHeader from "./CheckoutHeader";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
import ShippingForm from "./ShippingForm";
import { checkoutContainerVariants, checkoutItemVariants } from "./checkoutAnimations";

export default function CheckoutClient() {
  const { cartItems, subtotal } = useCart();
  const isClient = useIsClient();

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-surface-muted pb-24">
      <CheckoutHeader title="Secure Checkout" icon={Lock} backHref="/cart" backLabel="Back to Bag" />

      <div className="mx-auto max-w-[1200px] px-4 pt-12 sm:px-6 md:pt-16 lg:px-8">
        <CartNotices className="mb-8" />
        {cartItems.length === 0 ? (
          <CheckoutEmptyBag />
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={checkoutContainerVariants}
            className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16"
          >
            <motion.div variants={checkoutItemVariants} className="lg:col-span-7 xl:col-span-8">
              <h2 className="mb-6 text-[28px] font-semibold tracking-tight text-ink md:text-[32px]">
                Where should we send your order?
              </h2>
              <ShippingForm />
            </motion.div>

            <motion.div variants={checkoutItemVariants} className="lg:col-span-5 xl:col-span-4">
              <CheckoutOrderSummary items={cartItems} subtotal={subtotal} />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
