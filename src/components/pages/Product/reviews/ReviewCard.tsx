import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import { formatLongDate } from "@/lib/format";
import type { Review } from "@/types/review";
import StarRating from "./StarRating";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="border-b border-line-light py-6 last:border-b-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <StarRating rating={review.rating} />
        <time dateTime={review.createdAt} className="text-[13px] text-ink-subtle">
          {formatLongDate(review.createdAt)}
        </time>
      </div>
      <h3 className="mt-3 text-[17px] font-semibold text-ink">{review.title}</h3>
      <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-ink">{review.body}</p>

      {review.photos.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {review.photos.map((photo, index) => (
            <a
              key={photo}
              href={photo}
              target="_blank"
              rel="noopener noreferrer"
              className="relative h-20 w-20 overflow-hidden rounded-field bg-surface-muted md:h-24 md:w-24"
            >
              <Image src={photo} alt={`Photo ${index + 1} from ${review.authorName}`} fill sizes="96px" className="object-cover" />
            </a>
          ))}
        </div>
      )}

      <p className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-ink-muted">
        <span className="font-medium text-ink">{review.authorName}</span>
        {review.verifiedPurchase && (
          <span className="flex items-center gap-1 text-positive">
            <BadgeCheck size={15} className="text-positive" />
            Verified purchase
          </span>
        )}
      </p>
    </article>
  );
}
