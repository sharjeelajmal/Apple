"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import useProductSearch from "@/hooks/useProductSearch";

type SearchOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery(""); // Clear query on close
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const { products: filteredProducts, isSearching } = useProductSearch(query);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] bg-white/80 flex flex-col pt-16 md:pt-32 px-4 md:px-0"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 md:top-10 md:right-10 text-gray-500 hover:text-black transition-colors"
          >
            <X size={32} />
          </button>

          {/* Search Input Container */}
          <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
              className="w-full relative"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={28} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for products, accessories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-[24px] md:text-[40px] font-medium text-black placeholder:text-gray-300 border-b-2 border-gray-200 focus:border-black outline-none py-4 pl-14 md:pl-16 pr-4 transition-colors"
              />
            </motion.div>

            {/* Search Results */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full mt-12 max-h-[60vh] overflow-y-auto scrollbar-hide"
            >
              {query.length > 0 ? (
                filteredProducts.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {filteredProducts.map((product, idx) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={product.id}
                      >
                        <Link
                          href={`/products/${product.handle}`}
                          onClick={onClose}
                          className="flex items-center gap-6 p-4 hover:bg-white rounded-2xl transition-colors group"
                        >
                          <div className="w-20 h-20 bg-[#f5f5f7] rounded-xl relative flex-shrink-0 overflow-hidden">
                            <Image
                              src={product.image}
                              alt={product.title}
                              fill
                              className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[18px] font-semibold text-black group-hover:text-[#0071e3] transition-colors">
                              {product.title}
                            </span>
                            <span className="text-[#6e6e73]">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 text-[18px] mt-10">
                    {isSearching ? "Searching..." : <>No results found for &quot;{query}&quot;</>}
                  </div>
                )
              ) : (
                <div className="flex flex-col items-start gap-4 text-gray-500">
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-2">Suggested</h3>
                  <Link href="/products/apple-iphone-13-pro" onClick={onClose} className="text-[18px] hover:text-[#0071e3] transition-colors">iPhone 13 Pro</Link>
                  <Link href="/products/apple-imac-27-inch" onClick={onClose} className="text-[18px] hover:text-[#0071e3] transition-colors">iMac 27-inch</Link>
                  <Link href="/products/macbook-air-13-inch" onClick={onClose} className="text-[18px] hover:text-[#0071e3] transition-colors">Macbook Air</Link>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
