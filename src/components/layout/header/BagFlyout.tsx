"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";

interface BagFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
}

const bagLinks = [
  { label: "Saved Items", href: "/shop/saved" },
  { label: "Orders", href: "/shop/orders" },
  { label: "Account", href: "/shop/account" },
  { label: "Sign in", href: "/account/login" },
];

export default function BagFlyout({ isOpen, onClose }: BagFlyoutProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 top-[44px] bg-black/40 backdrop-blur-xl z-40"
          />

          {/* Bag Popover */}
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed right-4 md:right-[calc(50vw-490px)] top-[52px] w-[300px] sm:w-[340px] bg-[#fafafc] rounded-2xl border border-[#d2d2d7]/60 shadow-2xl p-6 z-50 text-left"
          >
            <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#1d1d1f] tracking-tight mb-6">
              Your Bag is empty.
            </h2>

            <div className="border-t border-[#d2d2d7]/50 pt-4">
              <h3 className="text-[12px] font-normal text-[#6e6e73] mb-3">
                My Profile
              </h3>
              <ul className="space-y-2.5">
                {bagLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="block text-[14px] text-[#1d1d1f] hover:text-[#0066CC] transition-colors py-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
