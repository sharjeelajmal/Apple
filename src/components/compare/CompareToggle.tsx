"use client";

import { useState, type MouseEvent } from "react";
import { Check, GitCompareArrows } from "lucide-react";
import useCompareList from "@/hooks/useCompareList";
import { MAX_COMPARE_ITEMS, toggleCompareItem, type CompareItem } from "@/lib/compareList";

const LIMIT_NOTICE_MS = 2500;

type CompareToggleProps = {
  item: CompareItem;
  variant?: "icon" | "button";
};

export default function CompareToggle({ item, variant = "icon" }: CompareToggleProps) {
  const items = useCompareList();
  const [showLimit, setShowLimit] = useState(false);
  const isSelected = items.some((existing) => existing.handle === item.handle);
  const label = isSelected ? "Remove from compare" : "Add to compare";

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!toggleCompareItem(item)) {
      setShowLimit(true);
      setTimeout(() => setShowLimit(false), LIMIT_NOTICE_MS);
    }
  };

  if (variant === "button") {
    return (
      <div>
        <button
          type="button"
          onClick={handleClick}
          aria-pressed={isSelected}
          className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-[14px] font-medium transition-colors ${
            isSelected ? "border-accent bg-accent/5 text-accent" : "border-line text-ink hover:border-ink"
          }`}
        >
          {isSelected ? <Check size={16} /> : <GitCompareArrows size={16} />}
          {isSelected ? "Added to compare" : "Compare with AI"}
        </button>
        {showLimit && <p className="mt-2 text-[13px] text-danger">You can compare up to {MAX_COMPARE_ITEMS} products.</p>}
      </div>
    );
  }

  return (
    <span className="relative">
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={isSelected}
        title={label}
        aria-label={label}
        className={`flex h-9 w-9 items-center justify-center rounded-full transition-all lg:bg-white/90 lg:shadow-[0_4px_12px_rgba(0,0,0,0.1)] lg:backdrop-blur-md lg:hover:scale-110 ${
          isSelected ? "text-accent" : "text-[#6e6e73] hover:text-[#1d1d1f]"
        }`}
      >
        {isSelected ? <Check size={18} /> : <GitCompareArrows size={18} />}
      </button>
      {showLimit && (
        <span className="absolute right-11 top-1 z-30 w-max rounded-full bg-ink px-3 py-1 text-[12px] text-white">
          Max {MAX_COMPARE_ITEMS} products
        </span>
      )}
    </span>
  );
}
