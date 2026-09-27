"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { FullProduct } from "@/types/catalog";
import ProductGallery from "@/components/pages/Product/ProductGallery";
import ProductInfo from "@/components/pages/Product/ProductInfo";

type QuickViewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: FullProduct | null;
};

export default function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-[1000px] max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-y-auto scrollbar-hide"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-[#f5f5f7] hover:bg-[#e5e5ea] text-gray-500 hover:text-black rounded-full flex items-center justify-center transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left: Gallery */}
                <div className="h-full min-h-[400px]">
                  <ProductGallery 
                    images={product.images} 
                    thumbnails={product.thumbnails} 
                    title={product.title} 
                  />
                </div>

                {/* Right: Info */}
                <div className="h-full pt-4">
                  <ProductInfo product={product} />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
