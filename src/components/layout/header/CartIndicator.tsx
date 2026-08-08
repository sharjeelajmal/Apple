"use client";

import { useState } from "react";
import Image from "next/image";

export default function CartIndicator() {
  // Placeholder for global state (e.g., Zustand or Context)
  const [itemCount] = useState(0);

  return (
    <button
      className="flex items-center justify-center h-full text-[#1d1d1f]/80 hover:text-[#1d1d1f] transition-colors relative"
      aria-label="Shopping Bag"
    >
      <Image
        src="/Header/bag.png"
        alt="Shopping Bag"
        width={16}
        height={16}
        className="w-[14px] h-auto object-contain"
      />
      {itemCount > 0 && (
        <span className="absolute top-[8px] right-[-6px] w-[14px] h-[14px] bg-[#0071e3] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
}
