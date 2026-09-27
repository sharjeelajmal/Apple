"use client";

import { motion } from "framer-motion";

export default function SuccessCheckmark() {
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="relative flex h-24 w-24 items-center justify-center"
    >
      <motion.span
        initial={{ scale: 0.8, opacity: 0.6 }}
        animate={{ scale: 1.6, opacity: 0 }}
        transition={{ duration: 1.4, delay: 0.4, ease: "easeOut" }}
        className="absolute inset-0 rounded-full bg-positive/30"
      />
      <svg viewBox="0 0 52 52" className="h-24 w-24">
        <circle cx="26" cy="26" r="26" className="fill-positive" />
        <motion.path
          d="M15 27 l7 7 l15 -16"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  );
}
