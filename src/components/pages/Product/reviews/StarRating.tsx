import { Star } from "lucide-react";

type StarRatingProps = {
  rating: number;
  size?: number;
};

export default function StarRating({ rating, size = 16 }: StarRatingProps) {
  return (
    <span className="flex text-[#f5c518]" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} size={size} fill={index < Math.round(rating) ? "currentColor" : "none"} />
      ))}
    </span>
  );
}
