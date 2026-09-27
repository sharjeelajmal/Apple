import Image from "next/image";
import { Button } from "@/components/ui/Button";

interface ProductShowcaseProps {
  headline?: string;
  subhead?: string;
  mediaUrl?: string;
  mediaAlt?: string;
}

export default function ProductShowcase({
  headline = "MacBook Air",
  subhead = "Now supercharged by M5.",
  mediaUrl = "/Home/macbook1.png",
  mediaAlt = "MacBook Air floating presentation showing thin profile and keyboard",
}: ProductShowcaseProps) {
  return (
    <section 
      aria-labelledby="product-showcase-headline"
      className="relative flex flex-col items-center pt-[40px] md:pt-[56px] min-h-[400px] md:min-h-[692px] bg-[#F5F5F7] overflow-hidden w-full isolate"
    >
      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-[570px] px-4 shrink-0">
        <div className="flex flex-col items-center gap-[6px] text-center w-full px-4">
          <h2 id="product-showcase-headline" className="font-semibold text-[32px] leading-[36px] md:text-[56px] md:leading-[60px] tracking-[-0.01em] md:tracking-[-0.28px] text-[#1D1D1F]">
            {headline}
          </h2>
          <p className="font-normal text-[19px] leading-[23px] md:text-[28px] md:leading-[32px] tracking-[0.01em] md:tracking-[0.196px] text-[#1D1D1F]">
            {subhead}
          </p>
        </div>

        <div className="flex flex-row flex-wrap justify-center items-start gap-[12px] md:gap-[17px] pt-[14px] md:pt-[17px]">
          <Button href="/macbook-air" variant="primary">
            Learn more
          </Button>
          <Button href="/shop/buy-mac" variant="secondary">
            Buy
          </Button>
        </div>
      </div>

      {/* Visuals Layer */}
      <div className="absolute inset-x-0 top-0 bottom-[-20px] z-0 flex justify-center items-end pointer-events-none">
        <Image
          src={mediaUrl}
          alt={mediaAlt}
          fill
          priority
          className="object-contain object-bottom scale-[2.2] sm:scale-[1.5] md:scale-[0.95] origin-bottom"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </div>
    </section>
  );
}
