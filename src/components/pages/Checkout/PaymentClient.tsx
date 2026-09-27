"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import useIsClient from "@/hooks/useIsClient";
import { readShippingDetails } from "@/services/checkoutStorage";
import CartNotices from "@/components/shared/CartNotices";
import CheckoutEmptyBag from "./CheckoutEmptyBag";
import CheckoutHeader from "./CheckoutHeader";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
import PaymentForm from "./PaymentForm";
import { checkoutContainerVariants, checkoutItemVariants } from "./checkoutAnimations";

export default function PaymentClient() {
  const router = useRouter();
  const { cartItems, subtotal } = useCart();
  const isClient = useIsClient();
  const [shipping] = useState(() => (typeof window === "undefined" ? null : readShippingDetails()));
  const hasItems = cartItems.length > 0;

  useEffect(() => {
    if (isClient && hasItems && !shipping) {
      router.replace("/checkout");
    }
  }, [isClient, hasItems, shipping, router]);

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-surface-muted pb-24">
      <CheckoutHeader title="Secure Payment" icon={Lock} backHref="/checkout" backLabel="Back to Shipping" />

      <div className="mx-auto max-w-[1200px] px-4 pt-12 sm:px-6 md:pt-16 lg:px-8">
        <CartNotices className="mb-8" />
        {!hasItems ? (
          <CheckoutEmptyBag />
        ) : (
          shipping && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={checkoutContainerVariants}
              className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16"
            >
              <motion.div variants={checkoutItemVariants} className="lg:col-span-7 xl:col-span-8">
                <h2 className="mb-6 text-[28px] font-semibold tracking-tight text-ink md:text-[32px]">
                  How would you like to pay?
                </h2>
                <PaymentForm shipping={shipping} />
              </motion.div>

              <motion.div variants={checkoutItemVariants} className="lg:col-span-5 xl:col-span-4">
                <CheckoutOrderSummary items={cartItems} subtotal={subtotal} />
              </motion.div>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
}
