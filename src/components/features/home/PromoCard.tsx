import Image from "next/image";
import Link from "next/link";

export interface PromoCardProps {
  id: string;
  title: string;
  headline?: string;
  subhead: string;
  logoUrl?: string;
  logoAlt?: string;
  logoHeight?: number;
  imageUrl: string;
  theme?: "light" | "dark";
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  footnoteSup?: string;
}

export default function PromoCard({
  id,
  title,
  headline,
  subhead,
  logoUrl,
  logoAlt,
  logoHeight = 44,
  imageUrl,
  theme = "light",
  primaryCtaText,
  primaryCtaHref,
  secondaryCtaText,
  secondaryCtaHref,
  footnoteSup,
}: PromoCardProps) {
  const isDark = theme === "dark";

  return (
    <div
      id={`promo-${id}`}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundPosition: "center bottom",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className={`relative flex flex-col items-center justify-start w-full min-h-[520px] sm:min-h-[600px] lg:min-h-[640px] overflow-hidden ${
        isDark ? "bg-black text-[#f5f5f7]" : "bg-[#f5f5f7] text-[#1d1d1f]"
      } select-none group transition-transform duration-300 hover:scale-[1.002]`}
    >
      {/* Clickable Full-Tile Link */}
      <Link
        href={primaryCtaHref}
        className="absolute inset-0 z-10"
        aria-label={title}
        tabIndex={-1}
      />

      {/* Content Header (Copy Wrapper) */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 pt-[46px] sm:pt-[56px] md:pt-[64px] max-w-[540px]">
        {logoUrl ? (
          <div
            className="flex items-center justify-center mb-[8px]"
            style={{ height: `${logoHeight}px` }}
          >
            <Image
              src={logoUrl}
              alt={logoAlt || title}
              width={300}
              height={logoHeight}
              className="h-full w-auto object-contain"
              priority
            />
          </div>
        ) : (
          <h3 className="font-semibold text-[36px] sm:text-[44px] md:text-[48px] lg:text-[52px] leading-[1.08] tracking-[-0.015em] font-sans">
            {headline || title}
          </h3>
        )}

        <p
          className={`mt-[6px] sm:mt-[8px] font-normal text-[19px] sm:text-[21px] md:text-[23px] leading-[1.22] tracking-[0.008em] max-w-[460px] ${
            isDark ? "text-[#f5f5f7]" : "text-[#1d1d1f]"
          }`}
        >
          {subhead}
          {footnoteSup && (
            <sup className="text-[11px] sm:text-[13px] ml-0.5 align-super">
              {footnoteSup}
            </sup>
          )}
        </p>

        {/* Action CTA Buttons */}
        <div className="relative z-30 flex flex-row items-center justify-center gap-[14px] sm:gap-[18px] mt-[16px] sm:mt-[20px]">
          <Link
            href={primaryCtaHref}
            className="inline-flex items-center justify-center text-[15px] sm:text-[16px] leading-[1.2] font-normal tracking-[-0.016em] px-[20px] sm:px-[24px] py-[9px] sm:py-[11px] min-w-[70px] rounded-full bg-[#0071e3] text-white hover:bg-[#0077ed] transition-colors shadow-sm"
          >
            {primaryCtaText}
          </Link>

          {secondaryCtaText && secondaryCtaHref && (
            <Link
              href={secondaryCtaHref}
              className={`inline-flex items-center justify-center text-[15px] sm:text-[16px] leading-[1.2] font-normal tracking-[-0.016em] px-[19px] sm:px-[23px] py-[8px] sm:py-[10px] min-w-[70px] rounded-full border transition-colors ${
                isDark
                  ? "border-[#f5f5f7] text-[#f5f5f7] hover:bg-[#f5f5f7] hover:text-black"
                  : "border-[#0071e3] text-[#0071e3] hover:bg-[#0071e3] hover:text-white"
              }`}
            >
              {secondaryCtaText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
