export const productCategories = [
  { slug: "apple-ipad", name: "Apple iPad" },
  { slug: "apple-watch", name: "Apple Watch" },
  { slug: "iphone", name: "iPhone" },
  { slug: "macbook", name: "MacBook" },
] as const;

export type CategorySlug = (typeof productCategories)[number]["slug"];

export const ALL_PRODUCTS_SLUG = "all";

export const isCategorySlug = (value: string): value is CategorySlug =>
  productCategories.some((category) => category.slug === value);

export const getCategoryName = (slug: string) =>
  productCategories.find((category) => category.slug === slug)?.name ?? "All Products";
