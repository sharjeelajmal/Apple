"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MEGA_MENU_DATA } from "@/config/megaMenuData";

export default function NavLinks() {
  const [activeMenuKey, setActiveMenuKey] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenuKey(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenuKey(null);
    }, 150);
  };

  const activeMenu = activeMenuKey ? MEGA_MENU_DATA[activeMenuKey] : null;

  return (
    <div
      onMouseEnter={() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }}
      onMouseLeave={handleMouseLeave}
      className="flex items-center h-full"
    >
      {/* Top Navbar Links */}
      <ul className="flex flex-row items-center justify-between h-full m-0 p-0 list-none gap-5 lg:gap-[28px]">
        {Object.entries(MEGA_MENU_DATA).map(([key, item]) => (
          <li
            key={key}
            onMouseEnter={() => handleMouseEnter(key)}
            className="flex items-center h-[44px]"
          >
            <Link
              href={item.href}
              className={`flex items-center text-[12px] leading-[1] font-normal tracking-[-0.01em] h-[44px] px-[8px] transition-colors duration-200 ${
                activeMenuKey === key
                  ? "text-black font-normal opacity-100"
                  : "text-black/80 hover:text-black opacity-80 hover:opacity-100"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Backdrop Curtain Overlay */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            className="fixed inset-0 top-[44px] bg-black/40 backdrop-blur-xl pointer-events-auto"
            style={{ zIndex: 40 }}
            onClick={() => setActiveMenuKey(null)}
          />
        )}
      </AnimatePresence>

      {/* Mega Menu Dropdown */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            key={activeMenu.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.6, 1] }}
            className="fixed inset-x-0 top-[44px] bg-[#fafafc] border-b border-[#d2d2d7]/50 shadow-2xl py-10 px-8"
            style={{ zIndex: 50 }}
          >
            <div className="max-w-[1024px] mx-auto grid grid-cols-3 gap-8">
              {activeMenu.columns.map((col, cIdx) => (
                <div key={col.title || cIdx} className="flex flex-col">
                  {col.title && (
                    <h3 className="text-[12px] leading-[1.33337] font-normal text-[#6e6e73] mb-3 tracking-[-0.01em]">
                      {col.title}
                    </h3>
                  )}
                  <ul className="flex flex-col space-y-2">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          onClick={() => setActiveMenuKey(null)}
                          className={`block transition-colors ${
                            col.isElevated
                              ? "text-[22px] lg:text-[24px] font-semibold text-[#1d1d1f] hover:text-[#0066CC] leading-tight py-1 tracking-[-0.015em]"
                              : "text-[12px] font-semibold text-[#1d1d1f] hover:text-[#0066CC] py-0.5 tracking-[-0.01em]"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
