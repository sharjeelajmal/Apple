import type { HomeContent } from "@/types/cms";
import { homeData } from "./legacyHomeData";

const COUNTDOWN_DAYS = 15;

const handlesOf = (products: { handle: string }[]) => products.map((product) => product.handle);

export const defaultHomeContent: HomeContent = {
  heroSlides: homeData.heroSlides.map(({ id, subtitle, title, description, buttonText, buttonLink, bgImage }) => ({
    id,
    subtitle,
    title,
    description,
    buttonText,
    buttonLink,
    image: bgImage,
  })),
  categoryBanners: [
    { id: "cat-1", title: "Smart\nWATCHES", subtitle: "FROM $45", image: "https://bigon-6.myshopify.com/cdn/shop/files/b2_2048x2048.jpg?v=1643520859", link: "/collections/apple-watch" },
    { id: "cat-2", title: "IPAD &\nIPAD AIR", subtitle: "FROM $99", image: "https://bigon-6.myshopify.com/cdn/shop/files/b1_2048x2048.jpg?v=1643522570", link: "/collections/apple-ipad" },
    { id: "cat-3", title: "TV &\nVIDEO", subtitle: "FROM $17", image: "https://bigon-6.myshopify.com/cdn/shop/files/b1_2048x2048.png?v=1643522992", link: "/collections/all" },
  ],
  carousel: {
    title: "iPhone Series",
    subtitle: "Check & Get Your Desired Product!",
    productHandles: handlesOf(homeData.carouselProducts),
  },
  trending: {
    title: "Trending Items",
    categories: ["macbook", "apple-ipad", "apple-watch"],
    productsPerTab: 4,
  },
  countdown: {
    title: homeData.countdown.title,
    subtitle: homeData.countdown.subtitle,
    image: homeData.countdown.bgImage,
    endDate: new Date(Date.now() + COUNTDOWN_DAYS * 24 * 60 * 60 * 1000).toISOString(),
  },
  testimonial: {
    author: homeData.testimonial.author,
    role: homeData.testimonial.role,
    quote: homeData.testimonial.quote,
    avatar: homeData.testimonial.avatar,
    productHandles: handlesOf(homeData.testimonialProducts),
  },
  features: homeData.newsletterFeatures.map(({ id, title, description, icon }) => ({
    id,
    title,
    description: description.replace(/\s*<br\s*\/?>\s*/g, "\n"),
    icon,
  })),
};
