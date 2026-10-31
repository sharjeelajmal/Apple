"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { ratingLabels } from "@/config/reviews";

export default function StarRatingInput({ name }: { name: string }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const active = hovered || rating;

  return (
    <div className="flex items-center gap-3">
      <input type="hidden" name={name} value={rating || ""} />
      <div className="flex" role="radiogroup" aria-label="Rating" onMouseLeave={() => setHovered(0)}>
        {ratingLabels.map((label, index) => {
          const value = index + 1;
          return (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} star${value > 1 ? "s" : ""} — ${label}`}
              onClick={() => setRating(value)}
              onMouseEnter={() => setHovered(value)}
              className="p-0.5 text-[#f5c518] transition-transform hover:scale-110"
            >
              <Star size={28} fill={value <= active ? "currentColor" : "none"} />
            </button>
          );
        })}
      </div>
      <span className="text-[14px] text-ink-muted">{active ? ratingLabels[active - 1] : "Tap to rate"}</span>
    </div>
  );
}
