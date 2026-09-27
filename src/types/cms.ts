import type { CategorySlug } from "@/config/categories";

export type HeroSlide = {
  id: string;
  subtitle: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
};

export type CategoryBanner = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
};

export type ProductShowcase = {
  title: string;
  subtitle: string;
  productHandles: string[];
};

export type TrendingSection = {
  title: string;
  categories: CategorySlug[];
  productsPerTab: number;
};

export type CountdownSection = {
  title: string;
  subtitle: string;
  image: string;
  endDate: string;
};

export type TestimonialSection = {
  author: string;
  role: string;
  quote: string;
  avatar: string;
  productHandles: string[];
};

export type ServiceFeature = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type HomeContent = {
  heroSlides: HeroSlide[];
  categoryBanners: CategoryBanner[];
  carousel: ProductShowcase;
  trending: TrendingSection;
  countdown: CountdownSection;
  testimonial: TestimonialSection;
  features: ServiceFeature[];
};

export type HomeSectionKey = keyof HomeContent;
