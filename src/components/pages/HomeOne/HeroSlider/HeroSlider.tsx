"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import type { HeroSlide } from "@/types/cms";

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full overflow-hidden bg-white group">
      <div className="relative w-full min-h-[350px] sm:min-h-[450px] lg:aspect-[2.4] lg:min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full bg-[#fbfbfb]"
          >
            <Image
              src={slides[currentIndex].image}
              alt="Hero Slide"
              fill
              priority
              className="object-contain object-[95%_center] md:object-cover md:object-center"
            />
            <div className="absolute inset-0 flex items-center">
              <div className="w-full max-w-[1200px] mx-auto px-6 sm:px-12 lg:px-8 relative z-10">
                <div className="w-[55%] md:max-w-[500px]">
                  <motion.h5
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="text-[#333333] text-[10px] sm:text-[12px] md:text-[16px] font-semibold uppercase mb-2 md:mb-8"
                  >
                    {slides[currentIndex].subtitle}
                  </motion.h5>
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.2 }}
                    className="text-[#333333] text-[20px] sm:text-[28px] md:text-[48px] lg:text-[56px] leading-[1.1] md:leading-[1.2] font-normal mb-2 md:mb-8 whitespace-pre-line"
                  >
                    {slides[currentIndex].title}
                  </motion.h2>
                  {slides[currentIndex].description && (
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 2, delay: 0.2 }}
                      className="text-[#333333] text-[12px] sm:text-[14px] md:text-[18px] mb-4 md:mb-8 line-clamp-2 md:line-clamp-none"
                    >
                      {slides[currentIndex].description}
                    </motion.p>
                  )}
                  <motion.a
                    href={slides[currentIndex].buttonLink}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 2.5, delay: 0.3 }}
                    className="inline-block bg-[#333333] text-white text-[10px] sm:text-[12px] md:text-[14px] uppercase font-medium tracking-widest px-4 sm:px-8 md:px-11 py-2 md:py-3 border border-[#333333] hover:bg-transparent hover:text-[#333333] transition-all duration-300"
                  >
                    {slides[currentIndex].buttonText}
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 lg:left-8 top-1/2 -translate-y-1/2 w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] bg-white flex items-center justify-center text-[#999999] shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#222222] hover:text-white z-10"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 lg:right-8 top-1/2 -translate-y-1/2 w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] bg-white flex items-center justify-center text-[#999999] shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#222222] hover:text-white z-10"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  );
}
