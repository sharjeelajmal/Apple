import type { CategorySlug } from "@/config/categories";

export type ProductStatus = "active" | "draft";

export type ProductColor = {
  name: string;
  hex: string;
  image?: string;
};

export type ProductVariant = {
  id: string;
  storage: string;
  color: { name: string; hex: string };
  price: number;
  inventory: number;
  image: string;
};

export type ProductInput = {
  title: string;
  handle: string;
  category: CategorySlug;
  status: ProductStatus;
  vendor: string;
  type: string;
  basePrice: number;
  description: string;
  images: string[];
  rating: number;
  totalReviews: number;
  availableStorages: string[];
  availableColors: ProductColor[];
  variants: ProductVariant[];
};

export type CatalogProduct = ProductInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type FullProduct = CatalogProduct & {
  thumbnails: string[];
};

export type ProductCardData = {
  id: string;
  title: string;
  handle: string;
  price: number;
  image: string;
  hoverImage?: string;
  isSoldOut?: boolean;
  colors?: string[];
};
