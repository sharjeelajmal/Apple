"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import type { ProductCardData } from "@/types/catalog";
import type { TestimonialSection } from "@/types/cms";
import SharedProductCard from "@/components/shared/ProductCard";

type TestimonialsProps = {
  testimonial: Omit<TestimonialSection, "productHandles">;
  products: ProductCardData[];
};

export default function Testimonials({ testimonial, products }: TestimonialsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <section className="w-full bg-[#f5f5f7] pt-16 pb-16 sm:pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px] lg:gap-[40px]">
          
          {/* Testimonial Section */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-1 lg:order-1 order-2"
          >
            <div className="bg-white p-[40px_30px] rounded-3xl h-full flex flex-col justify-center items-center text-center relative shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="mb-8">
                <Image 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  width={100} 
                  height={100} 
                  className="rounded-full mx-auto ring-4 ring-gray-50"
                />
              </div>
              
              <div className="text-[#1d1d1f] mb-8 relative">
                <Quote size={40} className="mx-auto mb-4 text-[#0071e3] opacity-20 transform -scale-x-100" />
                <p className="text-[17px] italic leading-relaxed text-[#6e6e73]">
                  "{testimonial.quote}"
                </p>
              </div>

              <div>
                <h3 className="text-[#1d1d1f] font-semibold text-[16px] uppercase tracking-wider mb-1">{testimonial.author}</h3>
                <p className="text-[#86868b] text-[13px] font-medium">{testimonial.role}</p>
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="lg:col-span-2 lg:order-2 order-1">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-2 sm:grid-cols-2 gap-x-[30px]"
            >
              {products.map((product) => (
                <motion.div 
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, scale: 0.9, y: 20 },
                    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } }
                  }}
                >
                  <SharedProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
