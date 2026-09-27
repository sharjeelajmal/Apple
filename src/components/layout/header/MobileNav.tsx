"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MEGA_MENU_DATA } from "@/config/megaMenuData";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const toggleCategory = (key: string) => {
    setExpandedKey(expandedKey === key ? null : key);
  };

  return (
    <div className="md:hidden flex items-center justify-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle navigation"
        className="relative flex items-center justify-center w-[18px] h-[18px]"
      >
        <span
          className={`absolute block w-[16px] h-[1.5px] bg-[#1d1d1f] transition-all duration-300 ${
            isOpen ? "rotate-45" : "-translate-y-[3.5px]"
          }`}
        />
        <span
          className={`absolute block w-[16px] h-[1.5px] bg-[#1d1d1f] transition-all duration-300 ${
            isOpen ? "-rotate-45" : "translate-y-[3.5px]"
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-[44px] bg-[#fafafc] w-screen h-[calc(100vh-44px)] p-6 flex flex-col overflow-y-auto z-50"
          >
            <nav className="pb-16">
              <ul className="flex flex-col space-y-4">
                {Object.entries(MEGA_MENU_DATA).map(([key, item]) => {
                  const isExpanded = expandedKey === key;
                  return (
                    <li key={key} className="border-b border-[#d2d2d7]/50 pb-3">
                      <div className="flex items-center justify-between">
                        <Link
                          href={item.href}
                          className="text-[22px] font-semibold text-[#1d1d1f] block"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.label}
                        </Link>
                        <button
                          onClick={() => toggleCategory(key)}
                          className="p-2 text-[#86868b] text-[18px]"
                          aria-label={`Toggle ${item.label} submenu`}
                        >
                          {isExpanded ? "−" : "+"}
                        </button>
                      </div>

                      {/* Accordion Submenu */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="pl-2 pt-3 space-y-3"
                          >
                            {item.columns.map((col, cIdx) => (
                              <div key={col.title || cIdx} className="space-y-1.5">
                                {col.title && (
                                  <h4 className="text-[12px] font-medium text-[#6e6e73]">
                                    {col.title}
                                  </h4>
                                )}
                                <ul className="space-y-1 pl-2">
                                  {col.links.map((link) => (
                                    <li key={link.label}>
                                      <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-[15px] font-medium text-[#1d1d1f] hover:text-[#0066CC] block py-0.5"
                                      >
                                        {link.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
