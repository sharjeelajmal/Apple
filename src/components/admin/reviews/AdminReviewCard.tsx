"use client";

import { BadgeCheck } from "lucide-react";
import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { deleteReview, setReviewStatus } from "@/actions/admin/reviewActions";
import StarRating from "@/components/pages/Product/reviews/StarRating";
import { formatLongDate } from "@/lib/format";
import type { AdminReview } from "@/types/review";
import ModerationActions from "./ModerationActions";

export default function AdminReviewCard({ review }: { review: AdminReview }) {
  const [isPending, startTransition] = useTransition();
  const isHidden = review.status === "hidden";

  const handleDelete = () => {
    if (window.confirm(`Delete the review from ${review.authorName}? This can't be undone.`)) {
      startTransition(() => deleteReview(review.id));
    }
  };

  return (
    <article
      className={`rounded-card border border-line-light bg-surface p-5 shadow-soft transition-opacity md:p-6 ${
        isPending ? "opacity-60" : ""
      }`}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href={`/products/${review.productHandle}`} target="_blank" className="text-[13px] text-accent hover:underline">
            {review.productTitle}
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <StarRating rating={review.rating} />
            {isHidden && <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-[12px] text-ink-muted">Hidden</span>}
          </div>
        </div>
        <time className="text-[13px] text-ink-subtle" dateTime={review.createdAt}>
          {formatLongDate(review.createdAt)}
        </time>
      </header>

      <h3 className="mt-3 text-[16px] font-semibold text-ink">{review.title}</h3>
      <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-ink">{review.body}</p>

      {review.photos.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {review.photos.map((photo, index) => (
            <a key={photo} href={photo} target="_blank" rel="noopener noreferrer" className="relative h-20 w-20 overflow-hidden rounded-field bg-surface-muted">
              <Image src={photo} alt={`Review photo ${index + 1}`} fill sizes="80px" className="object-cover" />
            </a>
          ))}
        </div>
      )}

      <p className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-ink-muted">
        {review.authorName} · {review.authorEmail}
        {review.verifiedPurchase && (
          <span className="flex items-center gap-1 text-positive">
            <BadgeCheck size={15} className="text-positive" />
            Verified purchase
          </span>
        )}
      </p>

      <footer className="mt-5 flex flex-wrap gap-2 border-t border-line-light pt-4">
        <ModerationActions
          status={review.status}
          isPending={isPending}
          onToggle={() => startTransition(() => setReviewStatus(review.id, isHidden ? "published" : "hidden"))}
          onDelete={handleDelete}
        />
      </footer>
    </article>
  );
}
