import type { CategorySlug } from "@/config/categories";
import type { ProductInput } from "@/types/catalog";
import { homeData, type Product as LegacyProduct } from "./legacyHomeData";
import { productMockData } from "./legacyProductData";

const DEFAULT_STOCK = 25;
const DEFAULT_DESCRIPTION =
  "Designed to be powerful, beautiful, and easy to use. Backed by the full manufacturer warranty and our expert support.";

const collectionProducts: LegacyProduct[] = [
  {
    id: "macbook-pro-16",
    title: "Astor Macbook Pro 16 inch",
    handle: "apple-macbook-pro-16-inch",
    price: 1999,
    image: "https://bigon-6.myshopify.com/cdn/shop/products/15_86068dcd-90b3-4151-b997-f1400617b87e_800x.png?v=1643627552",
    hoverImage: "https://bigon-6.myshopify.com/cdn/shop/products/16_e8db5b39-5435-4176-8b16-919dd19d0bfa_800x.png?v=1643627552",
  },
  {
    id: "macbook-pro-13-m1",
    title: "MacBook Pro 13 with M1",
    handle: "macbook-pro-13-with-m1",
    price: 1299,
    image: "https://bigon-6.myshopify.com/cdn/shop/products/16_f8424338-3405-4676-a0cc-e77fb7aa9b11_800x.png?v=1643608986",
    hoverImage: "https://bigon-6.myshopify.com/cdn/shop/products/13_47c37337-7e7f-41be-8a58-069394f58861_800x.png?v=1643608986",
    isSoldOut: true,
  },
];

const categoryPatterns: [RegExp, CategorySlug][] = [
  [/iphone/i, "iphone"],
  [/ipad|pad/i, "apple-ipad"],
  [/watch/i, "apple-watch"],
];

const guessCategory = (title: string): CategorySlug =>
  categoryPatterns.find(([pattern]) => pattern.test(title))?.[1] ?? "macbook";

const toProductInput = (product: LegacyProduct): ProductInput => {
  const images = [...new Set([product.image, product.hoverImage].filter(Boolean))];

  return {
    title: product.title,
    handle: product.handle,
    category: guessCategory(product.title),
    status: "active",
    vendor: "Apple",
    type: "Device",
    basePrice: product.price,
    description: DEFAULT_DESCRIPTION,
    images,
    rating: 5,
    totalReviews: 0,
    availableStorages: [],
    availableColors: [],
    variants: [
      {
        id: "default",
        storage: "",
        color: { name: "", hex: "" },
        price: product.price,
        inventory: product.isSoldOut ? 0 : DEFAULT_STOCK,
        image: images[0],
      },
    ],
  };
};

const detailedProducts: ProductInput[] = Object.values(productMockData).map((product) => ({
  title: product.title,
  handle: product.handle,
  category: guessCategory(product.title),
  status: "active",
  vendor: product.vendor,
  type: product.type,
  basePrice: product.basePrice,
  description: product.description,
  images: product.images,
  rating: product.rating,
  totalReviews: product.totalReviews,
  availableStorages: product.availableStorages,
  availableColors: product.availableColors,
  variants: product.variants.map((variant) => ({ ...variant, inventory: variant.inventory || DEFAULT_STOCK })),
}));

const legacyProducts = [
  ...homeData.carouselProducts,
  ...Object.values(homeData.trendingProducts).flat(),
  ...homeData.featuredProducts,
  ...homeData.testimonialProducts,
  ...collectionProducts,
];

const uniqueByHandle = (products: ProductInput[]) => [
  ...new Map(products.map((product) => [product.handle, product])).values(),
];

export const starterCatalog: ProductInput[] = uniqueByHandle([
  ...legacyProducts.map(toProductInput),
  ...detailedProducts,
]);
