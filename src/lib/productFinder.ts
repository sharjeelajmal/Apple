import {
  budgetRanges,
  essentialPattern,
  proPattern,
  sizeRules,
  type FinderAnswers,
  type SizeKey,
  type UseKey,
} from "@/config/productFinder";
import type { CategorySlug } from "@/config/categories";
import type { ProductCardData } from "@/types/catalog";

export type FinderProduct = ProductCardData & {
  category: CategorySlug;
};

export type FinderMatch = {
  product: FinderProduct;
  reasons: string[];
};

const MAX_MATCHES = 3;

const useScores: Record<UseKey, Record<UseKey, number>> = {
  essentials: { essentials: 3, creative: 2, power: 0 },
  creative: { essentials: 0, creative: 3, power: 2 },
  power: { essentials: 0, creative: 1, power: 4 },
};

const tierReasons: Record<UseKey, string> = {
  essentials: "Covers the everyday essentials",
  creative: "Great cameras and performance for creativity",
  power: "Pro-level performance",
};

const getTier = (title: string): UseKey => {
  if (proPattern.test(title)) return "power";
  if (essentialPattern.test(title)) return "essentials";
  return "creative";
};

const getSize = ({ category, title }: FinderProduct): Exclude<SizeKey, "any"> => {
  const rules = sizeRules[category];
  if (rules.large.test(title)) return "large";
  if (rules.compact.test(title)) return "compact";
  return "balanced";
};

const scoreBudget = (price: number, answers: FinderAnswers, reasons: string[]) => {
  const { min, max } = budgetRanges[answers.budget];

  if (price > max) return -2 - (price - max) / 250;
  if (price < min) {
    reasons.push("Comes in under your budget");
    return 2;
  }
  if (answers.budget !== "any") reasons.push("Fits your budget");
  return 4;
};

const scoreUse = (product: FinderProduct, answers: FinderAnswers, reasons: string[]) => {
  const tier = getTier(product.title);
  const score = useScores[answers.use][tier];
  if (score >= 3) reasons.push(tierReasons[tier]);
  return score;
};

const scoreSize = (product: FinderProduct, answers: FinderAnswers, reasons: string[]) => {
  if (answers.size === "any") return 0;

  const size = getSize(product);
  if (size === answers.size) {
    reasons.push(sizeRules[product.category].labels[size]);
    return 2;
  }
  return size !== "balanced" && answers.size !== "balanced" ? -1 : 0;
};

const scorePriority = (answers: FinderAnswers, recency: number, priceRatio: number, reasons: string[]) => {
  if (answers.priority === "latest") {
    if (recency > 0.8) reasons.push("One of the newest models");
    return 3 * recency;
  }
  if (priceRatio < 0.35) reasons.push("Excellent value for money");
  return 2 * (1 - priceRatio) + recency;
};

export function findBestMatches(products: FinderProduct[], answers: FinderAnswers): FinderMatch[] {
  const candidates = products.filter((product) => product.category === answers.category);
  if (!candidates.length) return [];

  const prices = candidates.map((product) => product.price);
  const lowestPrice = Math.min(...prices);
  const priceSpread = Math.max(...prices) - lowestPrice || 1;
  const lastIndex = Math.max(candidates.length - 1, 1);

  return candidates
    .map((product, index) => {
      const reasons: string[] = [];
      const recency = 1 - index / lastIndex;
      const priceRatio = (product.price - lowestPrice) / priceSpread;
      const score =
        scoreBudget(product.price, answers, reasons) +
        scoreUse(product, answers, reasons) +
        scoreSize(product, answers, reasons) +
        scorePriority(answers, recency, priceRatio, reasons) -
        (product.isSoldOut ? 6 : 0);

      return { product, reasons, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_MATCHES)
    .map(({ product, reasons }) => ({ product, reasons }));
}
