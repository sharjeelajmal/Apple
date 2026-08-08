"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/config/navigation";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center justify-center w-[30px] h-[44px] px-2 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle navigation"
        className="relative flex items-center justify-center w-[18px] h-[18px]"
      >
        <span
          className={`absolute block w-[16px] h-[1px] bg-[#1d1d1f] transition-all duration-300 ${
            isOpen ? "rotate-45 bg-[#1d1d1f]" : "-translate-y-[3px]"
          }`}
        ></span>
        <span
          className={`absolute block w-[16px] h-[1px] bg-[#1d1d1f] transition-all duration-300 ${
            isOpen ? "-rotate-45 bg-[#1d1d1f]" : "translate-y-[3px]"
          }`}
        ></span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-[44px] bg-white w-screen h-[calc(100vh-44px)] p-6 flex flex-col overflow-y-auto"
            style={{ position: 'fixed', zIndex: 9999 }}
          >
            <nav>
              <ul className="flex flex-col space-y-4">
                {NAV_LINKS.map((link) => (
                  <li key={link.label} className="border-b border-gray-200/50 pb-2">
                    <Link
                      href={link.href}
                      className="text-lg font-medium text-black/90 hover:text-black transition-colors block w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
