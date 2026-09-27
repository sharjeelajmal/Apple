export type ProductVariant = {
  id: string;
  storage: string;
  color: {
    name: string;
    hex: string;
  };
  price: number;
  inventory: number;
  image: string;
};

export type FullProduct = {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  type: string;
  basePrice: number;
  description: string;
  images: string[];
  thumbnails: string[];
  rating: number;
  totalReviews: number;
  variants: ProductVariant[];
  availableColors: { name: string; hex: string; image?: string }[];
  availableStorages: string[];
};

export const productMockData: Record<string, FullProduct> = {
  "apple-iphone-13-pro": {
    id: "6765734887483",
    title: "Astor iPhone 13 Pro",
    handle: "apple-iphone-13-pro",
    vendor: "otobi",
    type: "assorted",
    basePrice: 150.00,
    description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
    images: [
      "https://bigon-6.myshopify.com/cdn/shop/products/9_1f747b29-001e-450f-8939-d619d6479bca_1024x1024.jpg?v=1643606162",
      "https://bigon-6.myshopify.com/cdn/shop/products/11_466b7e59-bd93-4b4d-bfbb-cef9994ea83a_1024x1024.jpg?v=1643606162",
      "https://bigon-6.myshopify.com/cdn/shop/products/12_6d5acf4b-1896-495e-8f2d-396a58f95ff6_1024x1024.jpg?v=1643606162",
      "https://bigon-6.myshopify.com/cdn/shop/products/10_14171a3c-970c-462d-8c28-6ec483df7031_1024x1024.jpg?v=1643606109"
    ],
    thumbnails: [
      "https://bigon-6.myshopify.com/cdn/shop/products/9_1f747b29-001e-450f-8939-d619d6479bca_compact.jpg?v=1643606162",
      "https://bigon-6.myshopify.com/cdn/shop/products/11_466b7e59-bd93-4b4d-bfbb-cef9994ea83a_compact.jpg?v=1643606162",
      "https://bigon-6.myshopify.com/cdn/shop/products/12_6d5acf4b-1896-495e-8f2d-396a58f95ff6_compact.jpg?v=1643606162",
      "https://bigon-6.myshopify.com/cdn/shop/products/10_14171a3c-970c-462d-8c28-6ec483df7031_compact.jpg?v=1643606109"
    ],
    rating: 5,
    totalReviews: 24,
    availableStorages: ["128GB", "256GB"],
    availableColors: [
      { name: "gray", hex: "gray", image: "https://bigon-6.myshopify.com/cdn/shop/products/11_466b7e59-bd93-4b4d-bfbb-cef9994ea83a_100x100_crop_center.jpg?v=1643606162" },
      { name: "purple", hex: "purple", image: "https://bigon-6.myshopify.com/cdn/shop/products/12_6d5acf4b-1896-495e-8f2d-396a58f95ff6_100x100_crop_center.jpg?v=1643606162" },
      { name: "pink", hex: "pink", image: "https://bigon-6.myshopify.com/cdn/shop/products/10_14171a3c-970c-462d-8c28-6ec483df7031_100x100_crop_center.jpg?v=1643606109" }
    ],
    variants: [
      { id: "39988850294843", storage: "128GB", color: { name: "gray", hex: "gray" }, price: 150.00, inventory: 66, image: "https://bigon-6.myshopify.com/cdn/shop/products/11_466b7e59-bd93-4b4d-bfbb-cef9994ea83a_1024x1024.jpg?v=1643606162" },
      { id: "39988850327611", storage: "128GB", color: { name: "purple", hex: "purple" }, price: 150.00, inventory: 0, image: "https://bigon-6.myshopify.com/cdn/shop/products/12_6d5acf4b-1896-495e-8f2d-396a58f95ff6_1024x1024.jpg?v=1643606162" },
      { id: "39988850360379", storage: "128GB", color: { name: "pink", hex: "pink" }, price: 150.00, inventory: 0, image: "https://bigon-6.myshopify.com/cdn/shop/products/10_14171a3c-970c-462d-8c28-6ec483df7031_1024x1024.jpg?v=1643606109" },
      { id: "39988850393147", storage: "256GB", color: { name: "gray", hex: "gray" }, price: 150.00, inventory: 0, image: "https://bigon-6.myshopify.com/cdn/shop/products/11_466b7e59-bd93-4b4d-bfbb-cef9994ea83a_1024x1024.jpg?v=1643606162" },
      { id: "39988850425915", storage: "256GB", color: { name: "purple", hex: "purple" }, price: 150.00, inventory: 0, image: "https://bigon-6.myshopify.com/cdn/shop/products/12_6d5acf4b-1896-495e-8f2d-396a58f95ff6_1024x1024.jpg?v=1643606162" },
      { id: "39988850458683", storage: "256GB", color: { name: "pink", hex: "pink" }, price: 150.00, inventory: 0, image: "https://bigon-6.myshopify.com/cdn/shop/products/10_14171a3c-970c-462d-8c28-6ec483df7031_1024x1024.jpg?v=1643606109" },
    ]
  }
};
