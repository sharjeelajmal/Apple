"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { CountdownSection } from "@/types/cms";

export default function CountdownBanner({ data }: { data: CountdownSection }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Arbitrary future date for countdown
    const targetDate = new Date(data.endDate);
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [data.endDate]);

  const timeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <section 
      className="relative w-full bg-[#eff3f6] overflow-hidden pt-[60px] pb-[60px] md:pt-[100px] md:pb-[160px] lg:pt-[140px] lg:pb-[220px]"
    >
      {/* Background with Parallax/Scale effect */}
      <motion.div 
        initial={{ scale: 1 }}
        whileInView={{ scale: 1.05 }}
        transition={{ duration: 10, ease: "linear" }}
        className="absolute inset-0 bg-no-repeat bg-center bg-cover z-0"
        style={{ backgroundImage: `url("${data.image}")` }}
      />
      
      {/* Glass Overlay for better text readability */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] z-10" />

      <div className="relative z-20 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-10"
          >
            <h4 className="text-[#1d1d1f] font-semibold text-[14px] md:text-[16px] uppercase tracking-[0.2em] mb-3">{data.subtitle}</h4>
            <h1 className="text-[#1d1d1f] font-bold text-[36px] md:text-[56px] leading-[1.1] capitalize tracking-tight">{data.title}</h1>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.15 }}
            className="flex justify-center gap-4 md:gap-8 mb-12"
          >
            <motion.div variants={timeVariants} transition={{ type: "spring", stiffness: 100 }} className="flex flex-col items-center bg-white/60 backdrop-blur-md rounded-2xl w-[70px] h-[70px] md:w-[100px] md:h-[100px] justify-center shadow-sm">
              <span className="text-[#0071e3] font-bold text-[28px] md:text-[40px] leading-none">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="text-[#1d1d1f] text-[11px] md:text-[13px] uppercase font-bold tracking-widest mt-1 md:mt-2">Days</span>
            </motion.div>
            <motion.div variants={timeVariants} transition={{ type: "spring", stiffness: 100 }} className="flex flex-col items-center bg-white/60 backdrop-blur-md rounded-2xl w-[70px] h-[70px] md:w-[100px] md:h-[100px] justify-center shadow-sm">
              <span className="text-[#0071e3] font-bold text-[28px] md:text-[40px] leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[#1d1d1f] text-[11px] md:text-[13px] uppercase font-bold tracking-widest mt-1 md:mt-2">Hrs</span>
            </motion.div>
            <motion.div variants={timeVariants} transition={{ type: "spring", stiffness: 100 }} className="flex flex-col items-center bg-white/60 backdrop-blur-md rounded-2xl w-[70px] h-[70px] md:w-[100px] md:h-[100px] justify-center shadow-sm">
              <span className="text-[#0071e3] font-bold text-[28px] md:text-[40px] leading-none">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[#1d1d1f] text-[11px] md:text-[13px] uppercase font-bold tracking-widest mt-1 md:mt-2">Mins</span>
            </motion.div>
            <motion.div variants={timeVariants} transition={{ type: "spring", stiffness: 100 }} className="flex flex-col items-center bg-white/60 backdrop-blur-md rounded-2xl w-[70px] h-[70px] md:w-[100px] md:h-[100px] justify-center shadow-sm">
              <span className="text-[#0071e3] font-bold text-[28px] md:text-[40px] leading-none">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-[#1d1d1f] text-[11px] md:text-[13px] uppercase font-bold tracking-widest mt-1 md:mt-2">Secs</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className="text-[#1d1d1f] text-[16px] mb-6 uppercase font-bold tracking-wider">
              don't miss the offer <br />
            </p>
            <Link 
              href="/collections/all" 
              className="inline-block bg-[#1d1d1f] text-white uppercase text-[13px] font-bold px-10 py-4 rounded-full tracking-wider hover:bg-[#333336] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-300"
            >
              Shop Now
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
