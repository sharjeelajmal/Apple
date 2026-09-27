"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { ProductCardData } from "@/types/catalog";
import SharedProductCard from "@/components/shared/ProductCard";

export default function FeaturedProducts({ products }: { products: ProductCardData[] }) {
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
    <div className="w-full bg-[#f5f5f7] pb-16 sm:pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-center justify-between mb-12 pb-4 border-b border-gray-200/50"
        >
          <div className="mb-6 md:mb-0">
            <h2 className="text-[28px] md:text-[36px] font-semibold text-[#1d1d1f] tracking-tight">Featured Products</h2>
          </div>
          
          <div className="hidden md:block">
            <Link href="/collections/all" className="inline-block border border-gray-300 rounded-full text-[#1d1d1f] px-6 py-2 uppercase text-[12px] font-medium tracking-wider hover:bg-[#1d1d1f] hover:text-white hover:border-[#1d1d1f] transition-colors">
              View All
            </Link>
          </div>
        </motion.div>

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
                key={`featured-${product.id}`}
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
