import type { CategorySlug } from "./categories";

export type CollectionMenuGroup = {
  title: string;
  category: CategorySlug;
  searches: string[];
};

export const collectionMenu: CollectionMenuGroup[] = [
  {
    title: "iPhone",
    category: "iphone",
    searches: ["iPhone Duo", "iPhone 18", "iPhone 17", "iPhone Air", "iPhone 16", "iPhone 15", "iPhone 14"],
  },
  { title: "Mac", category: "macbook", searches: ["MacBook Neo", "MacBook Air", "MacBook Pro"] },
  { title: "iPad", category: "apple-ipad", searches: ["iPad Pro", "iPad Air", "iPad mini"] },
  { title: "Apple Watch", category: "apple-watch", searches: ["Watch Series", "Watch Ultra", "Watch SE"] },
];

export const COLLECTION_FILTER_KEYS = ["q", "availability", "minPrice", "maxPrice"] as const;
