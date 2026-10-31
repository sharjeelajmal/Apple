import "server-only";
import type { Review } from "@/types/review";
import { cacheKey, cachedAi } from "../cache";
import { generateJson, objectSchema, stringArray } from "../generateJson";

export type ReviewInsights = {
  overall: string;
  sentiment: "positive" | "mixed" | "negative";
  pros: string[];
  cons: string[];
};

export const MIN_REVIEWS_FOR_SUMMARY = 3;
const CACHE_HOURS = 24 * 30;
const MAX_REVIEWS = 60;

const schema = objectSchema({
  overall: { type: "string" },
  sentiment: { type: "string", enum: ["positive", "mixed", "negative"] },
  pros: stringArray,
  cons: stringArray,
});

const SYSTEM = `You summarize customer reviews for a product page. Base everything only on the reviews given.
- overall: one or two sentences on what customers think overall.
- pros: up to 4 short points customers liked, most mentioned first.
- cons: up to 3 short points customers disliked; return an empty list if nobody complained.
Keep every point under 12 words and don't quote names.`;

export async function summarizeReviews(productTitle: string, reviews: Review[]) {
  if (reviews.length < MIN_REVIEWS_FOR_SUMMARY) return null;

  const recent = reviews.slice(0, MAX_REVIEWS);
  const key = cacheKey("reviews", recent.map((review) => review.id));

  return cachedAi(key, CACHE_HOURS, () =>
    generateJson<ReviewInsights>({
      system: SYSTEM,
      schema,
      maxTokens: 3000,
      content: `Product: ${productTitle}\n\n${recent
        .map((review) => `${review.rating}/5 — ${review.title}: ${review.body}`)
        .join("\n")}`,
    })
  );
}
