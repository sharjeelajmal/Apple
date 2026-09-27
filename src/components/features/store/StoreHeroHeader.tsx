"use client";

import Link from "next/link";

export default function StoreHeroHeader() {
  return (
    <div className="w-full pt-10 md:pt-14 pb-8 md:pb-12 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Headline */}
        <div>
          <h1 className="text-[36px] sm:text-[44px] md:text-[48px] font-semibold text-[#1d1d1f] leading-[1.1] tracking-[-0.015em]">
            Store
          </h1>
        </div>

        {/* Right Help Cards */}
        <div className="flex flex-col gap-4 shrink-0 text-[14px]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3] shrink-0 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-[#1d1d1f]">Need shopping help?</p>
              <Link href="/retail" className="text-[#0066cc] hover:underline font-normal text-[13px]">
                Ask a Specialist
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3] shrink-0 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-[#1d1d1f]">Visit an Apple Store</p>
              <Link href="/retail" className="text-[#0066cc] hover:underline font-normal text-[13px]">
                Find one near you &gt;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
