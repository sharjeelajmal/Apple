"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";

interface HeroBannerProps {
  headline: string;
  subhead: string;
  mediaUrl: string;
  mediaAlt: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export default function HeroBanner({
  headline,
  subhead,
  mediaUrl,
  mediaAlt,
  primaryCtaText,
  primaryCtaHref,
  secondaryCtaText,
  secondaryCtaHref,
}: HeroBannerProps) {
  return (
    <section 
      aria-label="Main Announcement" 
      className="relative flex flex-col items-center pt-[40px] md:pt-[56px] min-h-[400px] md:min-h-[692px] bg-[#F5F5F7] overflow-hidden w-full isolate"
    >
      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-screen-xl px-4 shrink-0">
        <div className="flex flex-col items-center gap-[6px] text-center px-4">
          <h2 className="font-semibold text-[32px] leading-[36px] md:text-[56px] md:leading-[60px] tracking-[-0.01em] md:tracking-[-0.28px] text-[#1D1D1F]">
            {headline}
          </h2>
          <p className="font-normal text-[19px] leading-[23px] md:text-[28px] md:leading-[32px] tracking-[0.01em] md:tracking-[0.196px] text-[#1D1D1F]">
            {subhead}
          </p>
        </div>

        <div className="flex flex-row flex-wrap justify-center items-start gap-[12px] md:gap-[17px] pt-[14px] md:pt-[17px]">
          <Button href={primaryCtaHref} variant="primary">
            {primaryCtaText}
          </Button>
          {secondaryCtaText && secondaryCtaHref && (
            <Button href={secondaryCtaHref} variant="secondary">
              {secondaryCtaText}
            </Button>
          )}
        </div>
      </div>

      {/* Media Layer (Phones image) */}
      <div className="absolute inset-x-0 top-0 bottom-[-30px] z-0 flex justify-center items-end pointer-events-none">
        <Image
          src={mediaUrl}
          alt={mediaAlt}
          fill
          priority
          className="object-contain md:object-cover object-bottom scale-[3.2] sm:scale-[2] md:scale-[0.90] origin-bottom"
          sizes="(max-width: 768px) 3008px, (max-width: 1200px) 3008px, 3008px"
        />
      </div>
    </section>
  );
}
