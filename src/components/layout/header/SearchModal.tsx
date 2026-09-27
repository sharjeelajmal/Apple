"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const quickLinks = [
  { label: "Find a Store", href: "/retail" },
  { label: "Apple Vision Pro", href: "/apple-vision-pro" },
  { label: "AirPods", href: "/airpods" },
  { label: "Apple Intelligence", href: "/apple-intelligence" },
  { label: "Apple Trade In", href: "/shop/trade-in" },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");

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

          {/* Search Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[44px] bg-[#fafafc] border-b border-[#d2d2d7]/50 shadow-2xl py-8 px-6 z-50"
          >
            <div className="max-w-[700px] mx-auto flex flex-col gap-6">
              {/* Input */}
              <div className="flex items-center gap-3 border-b border-[#d2d2d7] pb-3">
                <svg
                  className="w-5 h-5 text-[#86868b]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search apple.com"
                  autoFocus
                  className="w-full bg-transparent text-[20px] font-normal text-[#1d1d1f] focus:outline-none placeholder-[#86868b]"
                />
                <button
                  onClick={onClose}
                  className="text-[13px] text-[#0066CC] hover:underline font-medium"
                >
                  Cancel
                </button>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-[12px] font-normal text-[#6e6e73] mb-3">
                  Quick Links
                </h3>
                <ul className="flex flex-col space-y-2.5">
                  {quickLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="flex items-center gap-2 text-[14px] font-semibold text-[#1d1d1f] hover:text-[#0066CC] transition-colors py-0.5"
                      >
                        <svg
                          className="w-3.5 h-3.5 text-[#86868b]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
