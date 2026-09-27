"use client";

import { motion } from "framer-motion";
import { Mail, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/format";
import useLastOrder from "@/hooks/useLastOrder";
import CheckoutHeader from "../CheckoutHeader";
import OrderItemsList from "@/components/shared/order/OrderItemsList";
import OrderProgress from "@/components/shared/order/OrderProgress";
import OrderSummaryCard from "./OrderSummaryCard";
import SuccessCheckmark from "./SuccessCheckmark";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 1, 0.5, 1] as const },
  }),
};

export default function OrderConfirmationClient() {
  const { order, isLoaded } = useLastOrder();

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-surface-muted pb-24">
      <CheckoutHeader title="Order Confirmed" icon={PackageCheck} />

      <div className="mx-auto max-w-[1100px] px-4 pt-12 sm:px-6 md:pt-16 lg:px-8">
        {order ? (
          <>
            <div className="flex flex-col items-center text-center">
              <SuccessCheckmark />
              <motion.h1
                initial="hidden"
                animate="visible"
                custom={0.4}
                variants={fadeUp}
                className="mt-8 text-[32px] font-semibold leading-tight tracking-tight text-ink md:text-[48px]"
              >
                Thank you. Your order is confirmed.
              </motion.h1>
              <motion.div initial="hidden" animate="visible" custom={0.5} variants={fadeUp}>
                <p className="mx-auto mt-4 max-w-[520px] text-[17px] text-ink-muted">
                  We&apos;ll email you a receipt and send updates as your order makes its way to you.
                </p>
                <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-surface px-5 py-2 text-[15px] text-ink shadow-soft">
                  Order No.
                  <span className="font-semibold tracking-wide">{order.id}</span>
                </p>
              </motion.div>
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              custom={0.65}
              variants={fadeUp}
              className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8"
            >
              <div className="flex flex-col gap-6 lg:col-span-7 xl:col-span-8">
                <section className="rounded-card border border-line-light bg-surface p-6 shadow-soft md:p-8">
                  <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[14px] text-ink-muted">Estimated delivery</p>
                      <h2 className="text-[24px] font-semibold tracking-tight text-ink">
                        {formatDate(order.estimatedDelivery, { weekday: "long", month: "long" })}
                      </h2>
                    </div>
                    <p className="flex items-center gap-2 text-[14px] text-ink-muted">
                      <Mail size={16} />
                      Tracking details will be emailed
                    </p>
                  </div>
                  <OrderProgress status={order.status ?? "placed"} />
                </section>

                <section className="rounded-card border border-line-light bg-surface p-6 shadow-soft md:p-8">
                  <h2 className="mb-6 text-[21px] font-semibold tracking-tight text-ink">
                    Items in your order
                  </h2>
                  <OrderItemsList items={order.items} />
                </section>
              </div>

              <aside className="lg:col-span-5 xl:col-span-4">
                <div className="lg:sticky lg:top-[100px]">
                  <OrderSummaryCard order={order} />
                </div>
              </aside>
            </motion.div>
          </>
        ) : (
          <div className="flex h-[50vh] flex-col items-center justify-center text-center">
            <h1 className="mb-3 text-[32px] font-semibold tracking-tight text-ink md:text-[40px]">
              No recent order found.
            </h1>
            <p className="mb-8 text-[17px] text-ink-muted">
              Once you place an order, its confirmation will appear here.
            </p>
            <Button href="/collections/all" className="font-medium">
              Start Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
