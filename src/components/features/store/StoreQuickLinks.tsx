"use client";

import Link from "next/link";

const quickLinks = [
  { label: "Order Status", href: "/shop/order-status" },
  { label: "Shopping Help", href: "/shop/help" },
  { label: "Returns", href: "/shop/refunds" },
  { label: "Your Saved Items", href: "/shop/account" },
];

export default function StoreQuickLinks() {
  return (
    <section className="w-full py-12 bg-white border-t border-[#d2d2d7]/50 mt-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[24px] font-semibold text-[#1d1d1f] mb-6">
          Quick Links
        </h2>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="inline-flex items-center px-4 py-2.5 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[14px] font-medium text-[#1d1d1f] transition-colors"
            >
              {link.label}
              <span className="ml-1.5 text-[#6e6e73]">&gt;</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
