"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ProductCardData } from "@/types/catalog";
import type { ProductShowcase } from "@/types/cms";
import SharedProductCard from "@/components/shared/ProductCard";

export default function ProductCarousel({ title, subtitle, products }: Omit<ProductShowcase, "productHandles"> & { products: ProductCardData[] }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="w-full bg-white pt-16 pb-12 sm:pt-20 sm:pb-16 lg:pt-[90px] lg:pb-[50px]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h1 className="text-[32px] md:text-[40px] text-[#1d1d1f] font-semibold mb-3 tracking-tight">{title}</h1>
          <p className="text-[16px] text-[#6e6e73] font-medium">{subtitle}</p>
        </motion.div>

        {/* Product Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-[30px]"
        >
          <AnimatePresence mode="popLayout">
            {products.map((product) => (
              <motion.div
                key={`carousel-${product.id}`}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              >
                <SharedProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
