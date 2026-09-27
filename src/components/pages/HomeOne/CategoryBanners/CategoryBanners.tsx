"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

import type { CategoryBanner } from "@/types/cms";

export default function CategoryBanners({ banners }: { banners: CategoryBanner[] }) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } 
    }
  };

  return (
    <div className="w-full bg-[#f5f5f7] pt-12 pb-12 mb-12 sm:mb-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]"
        >
          {banners.map((cat) => (
            <motion.div variants={itemVariants} key={cat.id} className="relative overflow-hidden group rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <Link href={cat.link || "#"} className="block relative w-full aspect-[1.74]">
                <Image
                  src={cat.image}
                  alt={cat.title.replace("\n", " ")}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                
                {/* Modern Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none transition-opacity duration-500 group-hover:opacity-80" />
                
                {/* Content Overlay */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full pl-8 md:pl-10 z-20 pointer-events-none">
                  <span className="block text-white text-[28px] md:text-[34px] leading-[1.2] font-semibold uppercase whitespace-pre-line mb-2 tracking-tight drop-shadow-md">
                    {cat.title}
                  </span>
                  <span className="block text-white/90 text-[12px] md:text-[14px] uppercase font-bold tracking-[0.2em] drop-shadow-sm">
                    {cat.subtitle}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
