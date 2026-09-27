"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import type { ServiceFeature } from "@/types/cms";

export default function NewsletterSection({ features }: { features: ServiceFeature[] }) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="w-full bg-white">
      {/* Features Section */}
      <div className="border-b border-[#f5f5f7] py-[60px] md:py-[100px]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8"
          >
            {features.map((feature) => (
              <motion.div variants={itemVariants} key={feature.id} className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="relative w-[80px] h-[80px] transition-transform duration-300 hover:scale-110">
                    <Image 
                      src={feature.icon} 
                      alt={feature.title} 
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <h4 className="text-[#1d1d1f] text-[20px] font-semibold mb-3 tracking-tight">{feature.title}</h4>
                <p className="text-[#6e6e73] text-[15px] leading-relaxed whitespace-pre-line">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="py-[80px] md:py-[120px] bg-[#fbfbfd]">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[32px] md:text-[44px] text-[#1d1d1f] font-semibold mb-8 tracking-tight"
          >
            Stay in the loop.
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form className="max-w-[500px] mx-auto relative flex items-center bg-white border border-[#d2d2d7] rounded-full overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-[#0071e3]/20 focus-within:border-[#0071e3] transition-all">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full h-[54px] bg-transparent pl-6 pr-36 text-[15px] text-[#1d1d1f] focus:outline-none placeholder-[#86868b]"
                required
              />
              <button 
                type="submit"
                className="absolute right-1 top-1 bottom-1 bg-[#1d1d1f] text-white rounded-full uppercase text-[12px] font-semibold tracking-wider px-6 hover:bg-[#333336] transition-colors"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
