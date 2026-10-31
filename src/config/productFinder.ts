import type { CategorySlug } from "@/config/categories";

export type BudgetKey = "under-500" | "500-999" | "1000-1499" | "1500-plus" | "any";
export type UseKey = "essentials" | "creative" | "power";
export type SizeKey = "compact" | "balanced" | "large" | "any";
export type PriorityKey = "latest" | "value";

export type FinderAnswers = {
  category: CategorySlug;
  budget: BudgetKey;
  use: UseKey;
  size: SizeKey;
  priority: PriorityKey;
};

export type FinderOption = {
  value: string;
  label: string;
  description: string;
};

export type FinderQuestion = {
  key: keyof FinderAnswers;
  title: string;
  options: FinderOption[];
};

export const budgetRanges: Record<BudgetKey, { min: number; max: number }> = {
  "under-500": { min: 0, max: 499 },
  "500-999": { min: 500, max: 999 },
  "1000-1499": { min: 1000, max: 1499 },
  "1500-plus": { min: 1500, max: Infinity },
  any: { min: 0, max: Infinity },
};

type SizeRule = {
  compact: RegExp;
  large: RegExp;
  labels: Record<Exclude<SizeKey, "any">, string>;
};

export const sizeRules: Record<CategorySlug, SizeRule> = {
  iphone: {
    compact: /\d+e\b/i,
    large: /\b(Max|Plus|Duo)\b/i,
    labels: { compact: "Compact and light", balanced: "Comfortable everyday size", large: "Big, immersive display" },
  },
  "apple-ipad": {
    compact: /\bmini\b/i,
    large: /\b(13|12\.9)-inch\b/i,
    labels: { compact: "Pocket-friendly mini size", balanced: "Easy-to-carry size", large: "Large canvas display" },
  },
  macbook: {
    compact: /\b13-inch\b|\bNeo\b/i,
    large: /\b(15|16)-inch\b/i,
    labels: { compact: "Ultra-portable size", balanced: "Balanced portable size", large: "Spacious large display" },
  },
  "apple-watch": {
    compact: /\bSE\b/i,
    large: /\bUltra\b/i,
    labels: { compact: "Light and simple", balanced: "Everyday size", large: "Rugged, large case" },
  },
};

export const proPattern = /\b(Pro|Max|Ultra|Duo)\b/i;
export const essentialPattern = /\b(SE|Neo)\b|\d+e\b|^iPad \(/i;

export const finderQuestions: FinderQuestion[] = [
  {
    key: "category",
    title: "What are you shopping for?",
    options: [
      { value: "iphone", label: "iPhone", description: "Calls, camera and everything in your pocket." },
      { value: "apple-ipad", label: "iPad", description: "Reading, drawing, notes and entertainment." },
      { value: "macbook", label: "Mac", description: "Study, office work and creative projects." },
      { value: "apple-watch", label: "Apple Watch", description: "Fitness, health and notifications on your wrist." },
    ],
  },
  {
    key: "budget",
    title: "What's your budget?",
    options: [
      { value: "under-500", label: "Under $500", description: "Great essentials at a friendly price." },
      { value: "500-999", label: "$500 – $999", description: "The sweet spot for most people." },
      { value: "1000-1499", label: "$1,000 – $1,499", description: "Premium features and more power." },
      { value: "1500-plus", label: "$1,500 and above", description: "The very best Apple makes." },
      { value: "any", label: "No fixed budget", description: "Just show me the best match." },
    ],
  },
  {
    key: "use",
    title: "How will you use it most?",
    options: [
      { value: "essentials", label: "Everyday essentials", description: "Messages, browsing, streaming and the basics." },
      { value: "creative", label: "Photos and creativity", description: "Shooting, editing and making things." },
      { value: "power", label: "Pro-level performance", description: "Heavy apps, gaming, multitasking or the outdoors." },
    ],
  },
  {
    key: "size",
    title: "Which size feels right?",
    options: [
      { value: "compact", label: "Smaller", description: "Light, portable and easy to hold." },
      { value: "balanced", label: "In between", description: "A balance of screen and portability." },
      { value: "large", label: "Bigger", description: "The largest display available." },
      { value: "any", label: "No preference", description: "Size doesn't matter to me." },
    ],
  },
  {
    key: "priority",
    title: "What matters more to you?",
    options: [
      { value: "latest", label: "The latest model", description: "Newest design and features." },
      { value: "value", label: "The best value", description: "The most for my money." },
    ],
  },
];
