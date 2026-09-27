"use client";

import Image from "next/image";
import Link from "next/link";

interface CategoryItem {
  name: string;
  href: string;
  image: string;
}

const categories: CategoryItem[] = [
  { name: "Mac", href: "/mac", image: "/images/store/store-mac.png" },
  { name: "iPhone", href: "/iphone", image: "/images/store/store-iphone.png" },
  { name: "iPad", href: "/ipad", image: "/images/store/store-ipad.png" },
  { name: "Apple Watch", href: "/watch", image: "/images/store/store-watch.png" },
  { name: "Apple Vision Pro", href: "/apple-vision-pro", image: "/images/store/store-vision-pro.png" },
  { name: "AirPods", href: "/airpods", image: "/images/store/store-airpods.png" },
  { name: "AirTag", href: "/airtag", image: "/images/store/store-airtag.png" },
  { name: "Apple TV 4K", href: "/tv-home", image: "/images/store/store-appletv.png" },
  { name: "HomePod", href: "/tv-home", image: "/images/store/store-homepod.png" },
  { name: "Accessories", href: "/shop/accessories", image: "/images/store/store-accessories.png" },
  { name: "Apple Gift Card", href: "/shop/gift-cards", image: "/images/store/store-giftcard.png" },
];

export default function StoreCategoryNav() {
  return (
    <div className="w-full pb-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar py-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="flex flex-col items-center shrink-0 group transition-transform duration-300 hover:scale-105"
            >
              <div className="relative w-[100px] sm:w-[120px] h-[70px] sm:h-[85px] flex items-center justify-center">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-contain"
                  sizes="120px"
                />
              </div>
              <span className="mt-2 text-[14px] font-semibold text-[#1d1d1f] group-hover:text-[#0066cc] transition-colors whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
