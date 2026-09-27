import PromoCard, { PromoCardProps } from "./PromoCard";

const promoItems: PromoCardProps[] = [
  {
    id: "ipad-air-m4",
    title: "iPad Air",
    logoUrl: "/images/logos/promo_logo_ipad_air.png",
    logoAlt: "iPad Air",
    logoHeight: 46,
    subhead: "Now supercharged by M4.",
    imageUrl: "/images/promo/promo_ipad_air_m4.jpg",
    theme: "light",
    primaryCtaText: "Learn more",
    primaryCtaHref: "/ipad-air",
    secondaryCtaText: "Buy",
    secondaryCtaHref: "/shop/buy-ipad/ipad-air",
  },
  {
    id: "macbook-pro",
    title: "MacBook Pro",
    headline: "MacBook Pro",
    subhead: "Now with M5, M5 Pro, and M5 Max.",
    imageUrl: "/images/promo/promo_macbook_pro.jpg",
    theme: "dark",
    primaryCtaText: "Learn more",
    primaryCtaHref: "/macbook-pro",
    secondaryCtaText: "Buy",
    secondaryCtaHref: "/shop/buy-mac/macbook-pro",
  },
  {
    id: "apple-watch-series-11",
    title: "Apple Watch Series 11",
    logoUrl: "/images/logos/promo_logo_apple_watch_series_11.png",
    logoAlt: "Apple Watch Series 11",
    logoHeight: 56,
    subhead: "The ultimate way to watch your health.",
    imageUrl: "/images/promo/promo_apple_watch_series_11.jpg",
    theme: "light",
    primaryCtaText: "Learn more",
    primaryCtaHref: "/apple-watch-series-11",
    secondaryCtaText: "Buy",
    secondaryCtaHref: "/shop/buy-watch/apple-watch-series-11",
  },
  {
    id: "ipad-pro",
    title: "iPad Pro",
    headline: "iPad Pro",
    subhead: "Advanced AI performance and game-changing capabilities.",
    imageUrl: "/images/promo/promo_ipad_pro.jpg",
    theme: "dark",
    primaryCtaText: "Learn more",
    primaryCtaHref: "/ipad-pro",
    secondaryCtaText: "Buy",
    secondaryCtaHref: "/shop/buy-ipad/ipad-pro",
  },
  {
    id: "iphone-tradein",
    title: "Apple Trade In",
    logoUrl: "/images/logos/promo_logo_iphone_tradein.png",
    logoAlt: "Apple Trade In",
    logoHeight: 46,
    subhead: "Get up to $205–$720 in credit when you trade in iPhone 13 or higher.",
    footnoteSup: "1",
    imageUrl: "/images/promo/promo_iphone_tradein.jpg",
    theme: "light",
    primaryCtaText: "Get your estimate",
    primaryCtaHref: "/shop/trade-in",
  },
  {
    id: "apple-card",
    title: "Apple Card",
    logoUrl: "/images/logos/promo_logo_apple_card.png",
    logoAlt: "Apple Card",
    logoHeight: 44,
    subhead: "Get up to 3% Daily Cash back with every purchase.",
    imageUrl: "/images/promo/promo_apple_card.jpg",
    theme: "light",
    primaryCtaText: "Learn more",
    primaryCtaHref: "/apple-card",
    secondaryCtaText: "Apply now",
    secondaryCtaHref: "https://card.apple.com/apply",
  },
];

export default function PromoGrid() {
  return (
    <section
      aria-label="Promotions Grid"
      className="w-full grid grid-cols-1 md:grid-cols-2 gap-[12px] p-[12px] max-w-[2560px] mx-auto"
    >
      {promoItems.map((item) => (
        <PromoCard key={item.id} {...item} />
      ))}
    </section>
  );
}
