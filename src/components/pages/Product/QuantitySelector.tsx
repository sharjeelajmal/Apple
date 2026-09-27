"use client";

import { Minus, Plus, Heart } from "lucide-react";

type QuantitySelectorProps = {
  quantity: number;
  maxQuantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onAddToCart: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isSoldOut: boolean;
  onAddToWishlist: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isWishlisted: boolean;
};

export default function QuantitySelector({
  quantity,
  maxQuantity,
  onIncrease,
  onDecrease,
  onAddToCart,
  isSoldOut,
  onAddToWishlist,
  isWishlisted
}: QuantitySelectorProps) {
  
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <div className="text-[14px] font-medium text-[#1d1d1f]">Quantity:</div>
        
        <div className="flex items-center h-[46px] border border-[#d2d2d7] rounded-full overflow-hidden bg-white">
          <button 
            onClick={onDecrease}
            disabled={quantity <= 1 || isSoldOut}
            className="w-[46px] h-full flex items-center justify-center text-[#1d1d1f] hover:bg-[#f5f5f7] disabled:opacity-50 transition-colors"
          >
            <Minus size={16} />
          </button>
          <div className="w-[40px] h-full flex items-center justify-center text-[15px] font-medium text-[#1d1d1f] border-x border-[#d2d2d7]">
            {quantity}
          </div>
          <button 
            onClick={onIncrease}
            disabled={quantity >= maxQuantity || isSoldOut}
            className="w-[46px] h-full flex items-center justify-center text-[#1d1d1f] hover:bg-[#f5f5f7] disabled:opacity-50 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          onClick={onAddToCart}
          disabled={isSoldOut}
          className="flex-1 h-[54px] bg-[#0071e3] text-white text-[15px] font-medium rounded-full flex items-center justify-center hover:bg-[#0077ED] disabled:bg-[#d2d2d7] disabled:text-[#86868b] transition-colors"
        >
          {isSoldOut ? "Sold Out" : "Add to Cart"}
        </button>
        
        <button 
          onClick={onAddToWishlist}
          className={`h-[54px] px-6 border ${isWishlisted ? "border-[#d3122a] text-[#d3122a]" : "border-[#d2d2d7] text-[#1d1d1f]"} text-[15px] font-medium rounded-full flex items-center justify-center gap-2 hover:border-[#86868b] hover:bg-[#f5f5f7] transition-all`}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          <span>{isWishlisted ? "Wishlisted" : "Wishlist"}</span>
        </button>
      </div>

      <div className="w-full">
        <button 
          disabled={isSoldOut}
          className="w-full h-[54px] bg-[#1d1d1f] text-white text-[15px] font-medium rounded-full flex items-center justify-center hover:bg-[#333336] disabled:bg-[#d2d2d7] disabled:text-[#86868b] transition-colors"
        >
          Buy it now
        </button>
      </div>
    </div>
  );
}
