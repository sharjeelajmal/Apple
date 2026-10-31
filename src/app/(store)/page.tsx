import type { Metadata } from "next";
import HeroSlider from "@/components/pages/HomeOne/HeroSlider/HeroSlider";
import CategoryBanners from "@/components/pages/HomeOne/CategoryBanners/CategoryBanners";
import ProductCarousel from "@/components/pages/HomeOne/ProductCarousel/ProductCarousel";
import TrendingProducts from "@/components/pages/HomeOne/TrendingProducts/TrendingProducts";
import CountdownBanner from "@/components/pages/HomeOne/CountdownBanner/CountdownBanner";
import Testimonials from "@/components/pages/HomeOne/Testimonials/Testimonials";
import NewsletterSection from "@/components/pages/HomeOne/NewsletterSection/NewsletterSection";
import ForYouSection from "@/components/ai/ForYouSection";
import { assistantConfig } from "@/config/env";
import { getCategoryName, type CategorySlug } from "@/config/categories";
import { siteConfig } from "@/config/site";
import { getProductsByHandles, getStorefrontProducts, toCardProduct } from "@/lib/catalog";
import { getHomeContent } from "@/lib/cms";

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: "Shop the latest iPhone, Mac, iPad, and Apple Watch with free delivery and expert support.",
};

const getTrendingTabs = async (categories: CategorySlug[], limit: number) => {
  const tabs = await Promise.all(
    categories.map(async (category) => {
      const products = await getStorefrontProducts({ category });
      return [getCategoryName(category), products.slice(0, limit).map(toCardProduct)] as const;
    })
  );
  return Object.fromEntries(tabs);
};

export default async function HomePage() {
  const content = await getHomeContent();
  const { carousel, trending, testimonial } = content;

  const [carouselProducts, testimonialProducts, trendingTabs] = await Promise.all([
    getProductsByHandles(carousel.productHandles),
    getProductsByHandles(testimonial.productHandles),
    getTrendingTabs(trending.categories, trending.productsPerTab),
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center p-0 m-0 w-full bg-white">
      <HeroSlider slides={content.heroSlides} />
      <CategoryBanners banners={content.categoryBanners} />
      <ProductCarousel
        title={carousel.title}
        subtitle={carousel.subtitle}
        products={carouselProducts.map(toCardProduct)}
      />
      {assistantConfig.isEnabled && <ForYouSection />}
      <TrendingProducts
        title={trending.title}
        categories={Object.keys(trendingTabs)}
        products={trendingTabs}
      />
      <CountdownBanner data={content.countdown} />
      <Testimonials testimonial={testimonial} products={testimonialProducts.map(toCardProduct)} />
      <NewsletterSection features={content.features} />
    </main>
  );
}
