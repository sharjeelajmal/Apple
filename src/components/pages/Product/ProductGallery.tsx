"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type ProductGalleryProps = {
  images: string[];
  thumbnails: string[];
  title: string;
};

export default function ProductGallery({ images, thumbnails, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      {/* Thumbnails - Vertical on Desktop, Horizontal on Mobile */}
      <div className="order-2 md:order-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto w-full md:w-[100px] scrollbar-hide shrink-0 pb-2 md:pb-0">
        {thumbnails.map((thumb, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`relative w-20 h-20 md:w-full md:h-[100px] shrink-0 border-[2px] transition-all rounded-lg overflow-hidden bg-[#fbfbfd] ${
              activeIndex === idx ? "border-[#0071e3]" : "border-transparent hover:border-[#d2d2d7]"
            }`}
            aria-label={`View image ${idx + 1}`}
          >
            <Image
              src={thumb}
              alt={`${title} thumbnail ${idx + 1}`}
              fill
              className="object-contain p-2"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="order-1 md:order-2 relative w-full aspect-square bg-[#fbfbfd] rounded-2xl overflow-hidden border border-[#f5f5f7]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={images[activeIndex]}
              alt={`${title} main view`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-8"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
