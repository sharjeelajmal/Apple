"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { FullProduct, ProductVariant } from "@/types/catalog";

type VariantSelectorProps = {
  product: FullProduct;
  selectedStorage: string;
  selectedColorHex: string;
  onStorageChange: (storage: string) => void;
  onColorChange: (hex: string) => void;
  selectedVariant: ProductVariant | undefined;
};

export default function VariantSelector({
  product,
  selectedStorage,
  selectedColorHex,
  onStorageChange,
  onColorChange,
  selectedVariant
}: VariantSelectorProps) {
  
  return (
    <div className="flex flex-col gap-8 mb-8">
      
      {/* Storage Selector */}
      {product.availableStorages && product.availableStorages.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="text-[14px] font-medium text-[#1d1d1f]">Storage: <span className="font-semibold">{selectedStorage}</span></div>
          <div className="flex flex-wrap gap-3">
            {product.availableStorages.map((storage) => {
              const isSelected = selectedStorage === storage;
              return (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  key={storage}
                  onClick={() => onStorageChange(storage)}
                  className={`min-w-[80px] h-[46px] rounded-full border flex items-center justify-center text-[14px] font-medium transition-colors ${
                    isSelected 
                      ? "border-[#0071e3] text-[#0071e3] ring-1 ring-[#0071e3] bg-[#0071e3]/5" 
                      : "border-[#d2d2d7] text-[#1d1d1f] hover:border-[#86868b]"
                  }`}
                >
                  {storage}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color Selector */}
      {product.availableColors && product.availableColors.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="text-[14px] font-medium text-[#1d1d1f]">
            Color: <span className="font-semibold capitalize">{product.availableColors.find(c => c.hex === selectedColorHex)?.name || "Select"}</span>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            {product.availableColors.map((color) => {
              const isSelected = selectedColorHex === color.hex;
              // Check if this specific color + selectedStorage is out of stock
              const variantForColor = product.variants.find(v => v.color.hex === color.hex && v.storage === selectedStorage);
              const isOutOfStock = variantForColor && variantForColor.inventory === 0;

              return (
                <motion.button
                  whileHover={{ scale: isOutOfStock ? 1 : 1.1 }}
                  whileTap={{ scale: isOutOfStock ? 1 : 0.9 }}
                  key={color.hex}
                  onClick={() => onColorChange(color.hex)}
                  className={`relative w-[40px] h-[40px] rounded-full flex items-center justify-center transition-shadow ${
                    isSelected ? "ring-2 ring-offset-2 ring-[#0071e3]" : ""
                  } ${isOutOfStock ? "opacity-50 cursor-not-allowed" : "opacity-100"}`}
                  title={`${color.name} ${isOutOfStock ? '(Sold Out)' : ''}`}
                >
                  {color.image ? (
                    <div className="relative w-full h-full rounded-full overflow-hidden border border-[#d2d2d7]">
                      <Image 
                        src={color.image}
                        alt={color.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div 
                      className="w-full h-full rounded-full border border-[#d2d2d7]"
                      style={{ backgroundColor: color.hex }}
                    />
                  )}
                  {/* Strikethrough if out of stock */}
                  {isOutOfStock && (
                     <div className="absolute inset-0 flex items-center justify-center w-full h-full pointer-events-none">
                       <div className="w-[120%] h-[2px] bg-[#d3122a] rotate-45" />
                     </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Availability Status */}
      {selectedVariant && (
        <div className={`text-[14px] font-medium ${selectedVariant.inventory > 0 ? "text-[#0071e3]" : "text-[#d3122a]"}`}>
          {selectedVariant.inventory > 0 ? `In Stock (${selectedVariant.inventory} available)` : "Sold Out"}
        </div>
      )}
    </div>
  );
}
