"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FaApple } from "react-icons/fa";
import { ShieldCheck } from "lucide-react";
import AuthBenefits from "./AuthBenefits";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 1, 0.5, 1] as const },
  }),
};

interface AuthShellProps {
  headline: string;
  highlight: string;
  description: string;
  cardTitle: string;
  cardSubtitle: string;
  footer: ReactNode;
  children: ReactNode;
}

export default function AuthShell({
  headline,
  highlight,
  description,
  cardTitle,
  cardSubtitle,
  footer,
  children,
}: AuthShellProps) {
  return (
    <section className="relative isolate overflow-hidden bg-surface-muted">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl lg:left-1/4" />
        <div className="absolute -bottom-40 right-0 h-[420px] w-[420px] rounded-full bg-fuchsia-400/10 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-28">
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeUp}
          className="text-center lg:text-left"
        >
          <p className="text-[14px] font-semibold uppercase tracking-[0.2em] text-accent">
            Apple Store Account
          </p>
          <h1 className="mt-4 text-[40px] font-semibold leading-[1.05] tracking-tight text-ink md:text-[56px]">
            {headline}{" "}
            <span className="bg-linear-to-r from-accent via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              {highlight}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-[460px] text-[17px] leading-relaxed text-ink-muted md:text-[19px] lg:mx-0">
            {description}
          </p>
          <div className="mt-10 hidden lg:block">
            <AuthBenefits />
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          custom={0.15}
          variants={fadeUp}
          className="mx-auto w-full max-w-[460px]"
        >
          <div className="rounded-[28px] border border-white/60 bg-surface/80 p-6 shadow-float backdrop-blur-xl sm:p-10">
            <div className="flex flex-col items-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-white">
                <FaApple size={28} />
              </span>
              <h2 className="mt-5 text-[28px] font-semibold tracking-tight text-ink">{cardTitle}</h2>
              <p className="mt-2 text-[15px] text-ink-muted">{cardSubtitle}</p>
            </div>

            <div className="mt-8">{children}</div>

            <p className="mt-8 text-center text-[14px] text-ink-muted">{footer}</p>
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 text-[13px] text-ink-subtle">
            <ShieldCheck size={16} className="text-positive" />
            Your information is protected with end-to-end encryption.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
