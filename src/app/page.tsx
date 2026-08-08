import HeroBanner from "@/components/features/home/HeroBanner";
import PromoSection from "@/components/features/home/PromoSection";
import ProductShowcase from "@/components/features/home/ProductShowcase";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-0 m-0 w-full bg-white gap-3 pb-3">
      <HeroBanner 
        headline="iPhone"
        subhead="Meet the latest iPhone lineup."
        mediaUrl="/Home/banner.png"
        mediaAlt="iPhone 17 Pro lineup"
        primaryCtaText="Learn more"
        primaryCtaHref="/iphone"
        secondaryCtaText="Shop iPhone"
        secondaryCtaHref="/shop/buy-iphone"
      />
      <PromoSection />
      <ProductShowcase />
    </main>
  );
}
