"use client";

import { useState, useMemo } from "react";
import StarRating from "./reviews/StarRating";
import { motion, type Variants } from "framer-motion";
import type { FullProduct } from "@/types/catalog";
import VariantSelector from "./VariantSelector";
import QuantitySelector from "./QuantitySelector";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export default function ProductInfo({ product }: { product: FullProduct }) {
  // Initial states based on the first available variant
  const initialVariant = product.variants.find(v => v.inventory > 0) || product.variants[0];
  
  const [selectedStorage, setSelectedStorage] = useState(initialVariant.storage);
  const [selectedColorHex, setSelectedColorHex] = useState(initialVariant.color.hex);
  const [quantity, setQuantity] = useState(1);

  // Derive the active variant from selections
  const activeVariant = useMemo(() => {
    return product.variants.find(
      (v) => v.storage === selectedStorage && v.color.hex === selectedColorHex
    );
  }, [product.variants, selectedStorage, selectedColorHex]);

  // Fallback if combination doesn't exist
  const isSoldOut = activeVariant ? activeVariant.inventory === 0 : true;
  const price = activeVariant ? activeVariant.price : product.basePrice;
  const inventory = activeVariant ? activeVariant.inventory : 0;

  const handleColorChange = (hex: string) => {
    setSelectedColorHex(hex);
    setQuantity(1);
  };

  const handleStorageChange = (storage: string) => {
    setSelectedStorage(storage);
    setQuantity(1);
  };

  const { addToWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);
  const { addToCart } = useCart();

  const handleWishlistClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    // Convert FullProduct to Product (since ProductCard expects fewer fields)
    const cardProduct = {
      id: product.id,
      title: product.title,
      price: price,
      image: product.images[0],
      hoverImage: product.images[1] || product.images[0],
      handle: product.handle,
    };
    addToWishlist(cardProduct, rect);
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    addToCart(
      {
        productId: product.id,
        title: product.title,
        handle: product.handle,
        price: price,
        image: product.images[0],
        quantity: quantity,
        variant: activeVariant ? {
          storage: activeVariant.storage,
          colorHex: activeVariant.color.hex,
          colorName: activeVariant.color.name,
        } : undefined
      },
      rect
    );
  };

  return (
    <motion.div 
      className="flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Title & Rating */}
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-[32px] md:text-[40px] font-semibold text-[#1d1d1f] mb-3 leading-tight tracking-tight">
          {product.title}
        </h1>
        <a href="#reviews" className="flex w-fit items-center gap-2">
          <StarRating rating={product.rating} />
          <span className="text-[13px] text-[#0071e3] hover:underline font-medium">
            {product.totalReviews ? `${product.totalReviews} ${product.totalReviews === 1 ? "Review" : "Reviews"}` : "Write the first review"}
          </span>
        </a>
      </motion.div>

      {/* Price */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="text-[24px] font-semibold text-[#1d1d1f] mb-1">
          ${price.toFixed(2)}
        </div>
        <p className="text-[14px] text-[#6e6e73] leading-relaxed max-w-lg mt-3">
          {product.description}
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="w-full h-px bg-[#e5e5ea] mb-8" />

      {/* Selectors */}
      <motion.div variants={itemVariants}>
        <VariantSelector 
          product={product}
          selectedStorage={selectedStorage}
          selectedColorHex={selectedColorHex}
          onStorageChange={handleStorageChange}
          onColorChange={handleColorChange}
          selectedVariant={activeVariant}
        />
      </motion.div>

      {/* Quantity & Add to Cart */}
      <motion.div variants={itemVariants}>
        <QuantitySelector
          quantity={quantity}
          maxQuantity={inventory}
          onIncrease={() => setQuantity(prev => Math.min(prev + 1, inventory))}
          onDecrease={() => setQuantity(prev => Math.max(prev - 1, 1))}
          onAddToCart={handleAddToCart}
          isSoldOut={isSoldOut}
          onAddToWishlist={handleWishlistClick}
          isWishlisted={isWishlisted}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="w-full h-px bg-[#e5e5ea] my-8" />

      {/* Meta Info */}
      <motion.div variants={itemVariants} className="flex flex-col gap-3 text-[14px] text-[#1d1d1f]">
        <div className="flex gap-2">
          <span className="font-semibold w-[80px]">Vendor:</span>
          <span className="text-[#6e6e73] uppercase tracking-wider">{product.vendor}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold w-[80px]">Type:</span>
          <span className="text-[#6e6e73] capitalize">{product.type}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
