"use client";

import { useState, type ReactNode } from "react";
import type { HomeContent, HomeSectionKey } from "@/types/cms";
import type { ProductOption } from "./ProductPicker";
import CarouselEditor from "./sections/CarouselEditor";
import CategoryBannersEditor from "./sections/CategoryBannersEditor";
import CountdownEditor from "./sections/CountdownEditor";
import FeaturesEditor from "./sections/FeaturesEditor";
import HeroSlidesEditor from "./sections/HeroSlidesEditor";
import TestimonialEditor from "./sections/TestimonialEditor";
import TrendingEditor from "./sections/TrendingEditor";

interface HomeCmsEditorProps {
  content: HomeContent;
  productOptions: ProductOption[];
}

const sectionLabels: Record<HomeSectionKey, string> = {
  heroSlides: "Hero Slider",
  categoryBanners: "Category Banners",
  carousel: "Product Carousel",
  trending: "Trending Items",
  countdown: "Countdown Banner",
  testimonial: "Testimonial",
  features: "Service Features",
};

export default function HomeCmsEditor({ content, productOptions }: HomeCmsEditorProps) {
  const [activeSection, setActiveSection] = useState<HomeSectionKey>("heroSlides");

  const editors: Record<HomeSectionKey, ReactNode> = {
    heroSlides: <HeroSlidesEditor initialValue={content.heroSlides} />,
    categoryBanners: <CategoryBannersEditor initialValue={content.categoryBanners} />,
    carousel: <CarouselEditor initialValue={content.carousel} productOptions={productOptions} />,
    trending: <TrendingEditor initialValue={content.trending} />,
    countdown: <CountdownEditor initialValue={content.countdown} />,
    testimonial: <TestimonialEditor initialValue={content.testimonial} productOptions={productOptions} />,
    features: <FeaturesEditor initialValue={content.features} />,
  };

  const sections = Object.keys(sectionLabels) as HomeSectionKey[];

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <nav aria-label="Home page sections" className="lg:sticky lg:top-10 lg:self-start">
        <p className="mb-3 hidden text-[12px] font-semibold uppercase tracking-wider text-ink-subtle lg:block">
          Sections (top to bottom)
        </p>
        <ol className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-1 lg:px-0">
          {sections.map((section, index) => (
            <li key={section} className="shrink-0">
              <button
                type="button"
                onClick={() => setActiveSection(section)}
                aria-current={activeSection === section ? "step" : undefined}
                className={`flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-left text-[14px] transition-colors lg:rounded-[10px] ${
                  activeSection === section ? "bg-ink text-white" : "bg-surface text-ink hover:bg-line-light lg:bg-transparent"
                }`}
              >
                <span className="text-[12px] opacity-60">{index + 1}</span>
                {sectionLabels[section]}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="min-w-0">
        {sections.map((section) => (
          <div key={section} hidden={activeSection !== section}>
            {editors[section]}
          </div>
        ))}
      </div>
    </div>
  );
}
