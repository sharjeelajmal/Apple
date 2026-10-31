export const upgradeDeviceSuggestions = [
  "iPhone 11",
  "iPhone 13",
  "iPhone 14 Pro",
  "iPhone 15",
  "MacBook Air (M1)",
  "MacBook Pro 2019 (Intel)",
  "iPad (9th generation)",
  "Apple Watch Series 6",
  "Samsung Galaxy S23",
];

export const upgradePriorities = ["Camera", "Battery life", "Performance", "Display", "Gaming", "Portability", "Storage"];

export const upgradeBudgets = [
  { label: "Flexible", value: 0 },
  { label: "Up to $600", value: 600 },
  { label: "Up to $900", value: 900 },
  { label: "Up to $1,200", value: 1200 },
  { label: "Up to $2,000", value: 2000 },
];

export const giftRecipients = ["Mom", "Dad", "Partner", "Brother", "Sister", "Friend", "Student", "Colleague", "Myself"];

export const giftOccasions = ["Birthday", "Eid", "Anniversary", "Graduation", "Wedding", "Just because"];

export const giftBudgets = [300, 500, 800, 1200, 2000];

export const giftInterests = ["Photography", "Fitness", "Gaming", "Music", "Reading", "Study", "Travel", "Work", "Drawing", "Movies"];

export type AiFeatureIcon =
  | "chat"
  | "compare"
  | "reviews"
  | "ask"
  | "camera"
  | "foryou"
  | "upgrade"
  | "gift"
  | "bag"
  | "address"
  | "orders"
  | "voice";

export type AiFeature = {
  title: string;
  description: string;
  icon: AiFeatureIcon;
  href?: string;
  opensAssistant?: boolean;
};

export const aiFeatures: AiFeature[] = [
  {
    title: "Shopping assistant",
    description: "Chat in English, Urdu or Hindi and share a photo of any device.",
    icon: "chat",
    opensAssistant: true,
  },
  {
    title: "Compare with AI",
    description: "Pick 2–3 products and get a side-by-side table with a clear verdict.",
    icon: "compare",
    href: "/compare?items=iphone-17-pro,iphone-17,iphone-air",
  },
  {
    title: "Review summaries",
    description: "Product pages sum up what customers like and dislike.",
    icon: "reviews",
    href: "/products/iphone-17#reviews",
  },
  {
    title: "Ask about a product",
    description: "Open the chat from any product page and ask about that exact model.",
    icon: "ask",
    href: "/products/macbook-air-13-inch-m5",
  },
  {
    title: "Search with a photo",
    description: "Upload a photo of a device and find it, or the closest match.",
    icon: "camera",
    href: "/search",
  },
  {
    title: "Picked for you",
    description: "Personal picks based on what you view, save and buy.",
    icon: "foryou",
    href: "/account",
  },
  {
    title: "Upgrade advisor",
    description: "Tell us your current device and see if upgrading is worth it.",
    icon: "upgrade",
    href: "/upgrade-advisor",
  },
  {
    title: "Gift finder",
    description: "Who it's for, the occasion and your budget, and AI picks the gift.",
    icon: "gift",
    href: "/gift-finder",
  },
  {
    title: "Smart bag check",
    description: "AI reviews your bag for storage, accessories and better value.",
    icon: "bag",
    href: "/cart",
  },
  {
    title: "Address check",
    description: "Checkout catches typos in your city, postal code or street.",
    icon: "address",
    href: "/checkout",
  },
  {
    title: "Cancel or return in chat",
    description: "Ask the assistant to cancel an order or start a return.",
    icon: "orders",
    opensAssistant: true,
  },
  {
    title: "Voice shopping",
    description: "Speak your question and hear the answer, hands-free.",
    icon: "voice",
    opensAssistant: true,
  },
];
