'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CollectionsHero({ title }: { title: string }) {
  return (
    <div className="bg-[#f5f5f7] py-[50px] w-full text-center relative overflow-hidden">
      <div className="max-w-[1200px] w-[95%] mx-auto px-[15px] relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="text-[40px] md:text-[56px] leading-[1.1] font-semibold text-[#1d1d1f] mb-[15px] capitalize tracking-tight"
        >
          {title}
        </motion.h1>
        
        <motion.ul 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex items-center justify-center gap-2 text-[14px] font-medium"
        >
          <li>
            <Link href="/" className="text-[#6e6e73] hover:text-[#0071e3] transition-colors">Home</Link>
          </li>
          <li className="text-[#a1a1a6] relative after:content-['/'] after:ml-2"></li>
          <li className="text-[#1d1d1f] capitalize">{title}</li>
        </motion.ul>
      </div>
      
      {/* Optional subtle gradient background element for premium feel */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-white/40 to-transparent blur-3xl pointer-events-none rounded-full"></div>
    </div>
  );
}
