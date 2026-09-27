"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

export interface ShelfCard {
  id: string;
  badge?: string;
  title: string;
  subtitle?: string;
  price?: string;
  image: string;
  theme?: "light" | "dark";
  cardType?: "standard" | "wide";
  isBackground?: boolean;
  href: string;
}

interface StoreShelfProps {
  sectionTitle: string;
  sectionSubtitle?: string;
  cards: ShelfCard[];
}

export default function StoreShelf({
  sectionTitle,
  sectionSubtitle,
  cards,
}: StoreShelfProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 15);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [cards]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -440 : 440;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <section className="w-full py-8 md:py-12 overflow-hidden">
      {/* Shelf Header */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex items-baseline justify-between">
        <div>
          <h2 className="text-[26px] sm:text-[28px] font-semibold text-[#1d1d1f] leading-tight tracking-[-0.015em]">
            <span className="text-[#1d1d1f] font-semibold">{sectionTitle}</span>{" "}
            {sectionSubtitle && (
              <span className="text-[#6e6e73] font-normal">{sectionSubtitle}</span>
            )}
          </h2>
        </div>

        {/* Apple Store Slider Controls */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Previous items"
            className={`w-[36px] h-[36px] rounded-full flex items-center justify-center transition-all ${
              canScrollLeft
                ? "bg-[#d2d2d7]/60 hover:bg-[#d2d2d7] text-[#1d1d1f] cursor-pointer shadow-sm"
                : "bg-[#d2d2d7]/20 text-[#86868b]/30 cursor-not-allowed"
            }`}
          >
            <svg
              height="16"
              viewBox="0 0 9 48"
              width="10"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current"
            >
              <path d="m1.5618 24.0621 6.5581-6.4238c.2368-.2319.2407-.6118.0088-.8486-.2324-.2373-.6123-.2407-.8486-.0088l-7 6.8569c-.1157.1138-.1807.2695-.1802.4316.001.1621.0674.3174.1846.4297l7 6.7241c.1162.1118.2661.1675.4155.1675.1577 0 .3149-.062.4326-.1846.2295-.2388.2222-.6187-.0171-.8481z" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Next items"
            className={`w-[36px] h-[36px] rounded-full flex items-center justify-center transition-all ${
              canScrollRight
                ? "bg-[#d2d2d7]/60 hover:bg-[#d2d2d7] text-[#1d1d1f] cursor-pointer shadow-sm"
                : "bg-[#d2d2d7]/20 text-[#86868b]/30 cursor-not-allowed"
            }`}
          >
            <svg
              height="16"
              viewBox="0 0 9 48"
              width="10"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current rotate-180"
            >
              <path d="m1.5618 24.0621 6.5581-6.4238c.2368-.2319.2407-.6118.0088-.8486-.2324-.2373-.6123-.2407-.8486-.0088l-7 6.8569c-.1157.1138-.1807.2695-.1802.4316.001.1621.0674.3174.1846.4297l7 6.7241c.1162.1118.2661.1675.4155.1675.1577 0 .3149-.062.4326-.1846.2295-.2388.2222-.6187-.0171-.8481z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Cards Scroller Platter with zero horizontal lines */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex items-stretch gap-[20px] overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto py-3 scroll-smooth"
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {cards.map((card) => {
          const isDark = card.theme === "dark";
          const isWide = card.cardType === "wide";
          const isBg = card.isBackground;

          return (
            <Link
              key={card.id}
              href={card.href}
              className={`group relative flex flex-col justify-between shrink-0 rounded-[18px] overflow-hidden p-7 sm:p-8 transition-all duration-300 hover:scale-[1.012] shadow-[2px_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[2px_12px_28px_rgba(0,0,0,0.12)] ${
                isWide
                  ? "w-[330px] sm:w-[440px] md:w-[480px] min-h-[500px]"
                  : "w-[310px] sm:w-[380px] md:w-[400px] min-h-[500px]"
              } ${
                isBg
                  ? ""
                  : isDark
                  ? "bg-[#000000] text-white"
                  : "bg-[#ffffff] text-[#1d1d1f]"
              }`}
              style={{
                scrollSnapAlign: "start",
                ...(isBg
                  ? {
                      backgroundImage: `url(${card.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }
                  : {}),
              }}
            >
              {/* Card Text Content */}
              <div className="relative z-10 max-w-[340px]">
                {card.badge && (
                  <p
                    className={`text-[12px] font-semibold tracking-wider uppercase mb-1.5 ${
                      isDark ? "text-[#a1a1a6]" : "text-[#6e6e73]"
                    }`}
                  >
                    {card.badge}
                  </p>
                )}
                <h3
                  className={`text-[24px] sm:text-[28px] font-semibold leading-[1.14286] tracking-[-0.015em] mb-1.5 ${
                    isDark ? "text-white" : "text-[#1d1d1f]"
                  }`}
                >
                  {card.title}
                </h3>
                {card.subtitle && (
                  <p
                    className={`text-[14px] font-normal leading-[1.35] ${
                      isDark ? "text-[#a1a1a6]" : "text-[#6e6e73]"
                    }`}
                  >
                    {card.subtitle}
                  </p>
                )}
                {card.price && (
                  <p
                    className={`text-[14px] font-normal mt-2.5 ${
                      isDark ? "text-[#f5f5f7]" : "text-[#1d1d1f]"
                    }`}
                  >
                    {card.price}
                  </p>
                )}
              </div>

              {/* Bottom Image Container (Only rendered if NOT background image) */}
              {!isBg && (
                <div className="relative w-full h-[270px] sm:h-[300px] mt-auto pointer-events-none flex items-center justify-center">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-contain object-bottom group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 330px, 480px"
                  />
                </div>
              )}

              {/* Glassy Arrow */}
              <div
                className={`absolute bottom-6 right-6 w-11 h-11 rounded-full backdrop-blur-md border flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 z-20 ${
                  isDark
                    ? "bg-white/20 border-white/30 text-white"
                    : "bg-white/60 border-white/40 text-[#1d1d1f]"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
