"use client";

import React from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import QuickViewModal from './QuickViewModal';
import CompareToggle from '@/components/compare/CompareToggle';
import type { FullProduct, ProductCardData } from '@/types/catalog';

export type Product = ProductCardData;

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = isInWishlist(product.id);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [fullProduct, setFullProduct] = useState<FullProduct | null>(null);

  const handleWishlistClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    addToWishlist(product, rect);
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    addToCart(
      {
        productId: product.id,
        title: product.title,
        handle: product.handle,
        price: product.price,
        image: product.image,
        quantity: 1,
      },
      rect
    );
  };

  const handleQuickViewClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const response = await fetch(`/api/products/${product.handle}`);
    if (!response.ok) return;
    setFullProduct(await response.json());
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div className="group relative mb-11 bg-white rounded-2xl p-4 transition-all duration-500 shadow-md hover:shadow-xl hover:-translate-y-1">
      {/* Product Image Box */}
      <div className="relative overflow-hidden w-full pt-[100%] rounded-xl bg-white shadow-subtle">
        <Link href={`/products/${product.handle}`} className="absolute top-0 left-0 w-full h-full block text-center p-6">
          <img
            src={product.image}
            alt={product.title}
            className="absolute top-[10%] left-[10%] w-[80%] h-[80%] object-contain transition-all duration-[900ms] opacity-100 group-hover:opacity-0 group-hover:scale-95"
          />
          {product.hoverImage && (
            <img
              src={product.hoverImage}
              alt={product.title}
              className="absolute top-[10%] left-[10%] w-[80%] h-[80%] object-contain transition-all duration-[900ms] opacity-0 group-hover:opacity-100 group-hover:scale-105 z-10"
            />
          )}
        </Link>

        {/* Badges */}
        {product.isSoldOut && (
          <div className="absolute top-4 left-4 z-20 flex flex-col pointer-events-none">
            <span className="bg-[#1d1d1f] text-white text-[12px] font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">Sold Out</span>
          </div>
        )}



        {/* Variations (Desktop Hover) */}
        {product.colors && product.colors.length > 0 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-auto z-20 px-3 py-2 opacity-0 group-hover:opacity-100 transition-all duration-500 hidden lg:block bg-white/80 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-full border border-white/40">
            <div className="text-center">
              <ul className="flex items-center justify-center flex-wrap gap-2">
                {product.colors.map((color, idx) => (
                  <li key={idx} className="w-5 h-5 rounded-full hover:scale-125 transition-transform duration-300">
                    <button className="w-full h-full rounded-full overflow-hidden border border-black/10 shadow-inner" title={color}>
                      <div className="w-full h-full" style={{ backgroundColor: color }}></div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Action Icons (Mobile: Below image, Desktop: Top Right) */}
      <div className="flex justify-center gap-4 mt-4 lg:mt-0 lg:absolute lg:top-8 lg:right-8 z-20 lg:flex-col lg:gap-2">
        <span className="opacity-100 translate-x-0 lg:opacity-0 lg:translate-x-4 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 transition-all duration-400 ease-out lg:delay-[50ms]">
          <button 
            onClick={handleWishlistClick}
            className={`w-9 h-9 lg:bg-white/90 lg:backdrop-blur-md text-[#6e6e73] hover:text-[#d3122a] flex items-center justify-center rounded-full lg:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:lg:shadow-[0_4px_16px_rgba(0,0,0,0.15)] lg:hover:scale-110 transition-all ${isWishlisted ? "text-[#d3122a]" : ""}`}
            title="Add to Wishlist"
          >
            <Heart size={18} className="font-medium" fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </span>
        <span className="opacity-100 translate-x-0 lg:opacity-0 lg:translate-x-4 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 transition-all duration-500 ease-out lg:delay-[100ms]">
          <button 
            onClick={handleAddToCart}
            className="w-9 h-9 lg:bg-white/90 lg:backdrop-blur-md text-[#6e6e73] hover:text-[#1d1d1f] flex items-center justify-center rounded-full lg:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:lg:shadow-[0_4px_16px_rgba(0,0,0,0.15)] lg:hover:scale-110 transition-all"
            title="Add to Cart"
          >
            <ShoppingBag size={18} className="font-medium" />
          </button>
        </span>
        <span className="opacity-100 translate-x-0 lg:opacity-0 lg:translate-x-4 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 transition-all duration-600 ease-out lg:delay-[150ms]">
          <button 
            onClick={handleQuickViewClick}
            className="w-9 h-9 lg:bg-white/90 lg:backdrop-blur-md text-[#6e6e73] hover:text-[#1d1d1f] flex items-center justify-center rounded-full lg:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:lg:shadow-[0_4px_16px_rgba(0,0,0,0.15)] lg:hover:scale-110 transition-all"
            title="Quick View"
          >
            <Search size={18} className="font-medium" />
          </button>
        </span>
        <span className="opacity-100 translate-x-0 lg:opacity-0 lg:translate-x-4 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 transition-all duration-700 ease-out lg:delay-[200ms]">
          <CompareToggle item={{ handle: product.handle, title: product.title, image: product.image }} />
        </span>
      </div>

      {/* Product Content */}
      <div className="relative pt-[12px] lg:pt-[20px] px-2 text-center">
        <div className="relative overflow-hidden">
          {/* Title */}
          <h3 className="text-[17px] leading-[1.4] font-medium text-[#1d1d1f] transition-transform duration-500 group-hover:-translate-y-8 group-hover:opacity-0 block">
            <Link href={`/products/${product.handle}`} className="hover:text-[#0071e3] transition-colors line-clamp-1">
              {product.title}
            </Link>
          </h3>
          
          {/* Cart Action */}
          <div className="absolute bottom-0 left-0 w-full translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex justify-center">
            {product.isSoldOut ? (
              <button disabled className="text-[#a1a1a6] text-[15px] font-semibold flex items-center cursor-not-allowed uppercase tracking-wider">
                Sold Out
              </button>
            ) : (
              <Link href={`/products/${product.handle}`} className="text-[#0071e3] text-[15px] font-semibold flex items-center hover:text-[#0077ed] uppercase tracking-wider">
                <span className="mr-1 text-lg leading-none mb-[2px]">+</span> Select Options
              </Link>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="mt-2 transition-transform duration-500 group-hover:translate-y-1">
          <span className="text-[15px] leading-none font-semibold text-[#6e6e73]">
            ${(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
      </div>
      
      <QuickViewModal 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
        product={fullProduct} 
      />
    </>
  );
}
