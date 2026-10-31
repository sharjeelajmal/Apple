"use client";

import { useState } from "react";
import { REVIEWS_PAGE_SIZE } from "@/config/reviews";
import type { Review } from "@/types/review";
import ReviewCard from "./ReviewCard";

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  const [visibleCount, setVisibleCount] = useState(REVIEWS_PAGE_SIZE);
  const [photosOnly, setPhotosOnly] = useState(false);

  const photoReviewCount = reviews.filter((review) => review.photos.length > 0).length;
  const filtered = photosOnly ? reviews.filter((review) => review.photos.length > 0) : reviews;
  const visible = filtered.slice(0, visibleCount);

  return (
    <div>
      {photoReviewCount > 0 && (
        <div className="mb-2 flex gap-2">
          {[
            { label: `All (${reviews.length})`, value: false },
            { label: `With photos (${photoReviewCount})`, value: true },
          ].map((filter) => (
            <button
              key={filter.label}
              type="button"
              onClick={() => setPhotosOnly(filter.value)}
              aria-pressed={photosOnly === filter.value}
              className={`rounded-full border px-4 py-1.5 text-[13px] transition-colors ${
                photosOnly === filter.value ? "border-ink bg-ink text-white" : "border-line text-ink hover:border-ink"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}

      {visible.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}

      {filtered.length > visibleCount && (
        <button
          type="button"
          onClick={() => setVisibleCount((count) => count + REVIEWS_PAGE_SIZE)}
          className="mt-4 rounded-full border border-line px-6 py-2.5 text-[14px] font-medium text-ink transition-colors hover:border-ink"
        >
          Show more reviews
        </button>
      )}
    </div>
  );
}
