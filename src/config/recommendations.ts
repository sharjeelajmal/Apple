import type { CategorySlug } from "@/config/categories";

export const FREQUENTLY_BOUGHT_LIMIT = 2;

export const complementaryCategories: Record<CategorySlug, CategorySlug[]> = {
  iphone: ["apple-watch", "apple-ipad"],
  "apple-watch": ["iphone", "apple-ipad"],
  "apple-ipad": ["macbook", "apple-watch"],
  macbook: ["apple-ipad", "iphone"],
};
