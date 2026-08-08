"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";

export default function PromoSection() {
  return (
    <section 
      aria-labelledby="promo-headline"
      className="relative flex flex-col items-center pt-[40px] md:pt-[56px] bg-[#F5F5F7] overflow-hidden w-full isolate"
    >
      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-[570px] px-4 shrink-0">
        <div className="flex flex-col items-center gap-[6px] text-center w-full px-4">
          <h2 id="promo-headline" className="font-semibold text-[32px] leading-[36px] md:text-[56px] md:leading-[60px] tracking-[-0.01em] md:tracking-[-0.28px] text-[#1D1D1F]">
            College, sorted.
          </h2>
          <p className="font-normal text-[19px] leading-[23px] md:text-[28px] md:leading-[32px] tracking-[0.01em] md:tracking-[0.196px] text-[#1D1D1F] max-w-[280px] md:max-w-2xl">
            Get a gift card from $100 to $150* when you buy Mac or iPad with education savings.
          </p>
        </div>

        <div className="flex flex-row flex-wrap justify-center items-start pt-[14px] md:pt-[17px]">
          <Button href="/shop/education" variant="primary">
            Shop
          </Button>
        </div>
      </div>

      {/* Visuals Layer */}
      {/* Standard document flow container with fixed height. Negative margin pulls it UP to close the gap. */}
      <div className="relative w-full h-[250px] md:h-[450px] mt-[10px] md:mt-[-70px] mb-0 md:mb-[-30px] z-0 pointer-events-none">
        <div className="relative w-full h-full mx-auto">
          <Image
            src="/Home/collegestudents.png"
            alt="College students holding Mac and iPad"
            fill
            priority
            className="object-contain md:object-cover object-bottom scale-[3.2] sm:scale-[2] md:scale-100 origin-bottom"
            sizes="(max-width: 768px) 100vw, 100vw"
          />
        </div>
      </div>
      
    </section>
  );
}
