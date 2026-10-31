import type { AssistantImageType } from "@/types/assistant";

export const ASSISTANT_MAX_TOKENS = 8000;
export const ASSISTANT_VOICE_MAX_TOKENS = 2000;
export const ASSISTANT_MAX_TOOL_ROUNDS = 5;
export const ASSISTANT_MAX_HISTORY = 16;
export const ASSISTANT_MAX_MESSAGE_LENGTH = 1000;
export const ASSISTANT_MAX_PRODUCT_CARDS = 3;
export const ASSISTANT_MAX_IMAGES_PER_MESSAGE = 3;
export const ASSISTANT_IMAGE_MAX_DIMENSION = 1280;
export const ASSISTANT_IMAGE_MAX_BYTES = 1.5 * 1024 * 1024;
export const ASSISTANT_IMAGE_TURNS_KEPT = 2;
export const ASSISTANT_RATE_LIMIT = { requests: 30, windowMs: 10 * 60 * 1000 };
export const ASSISTANT_STORAGE_KEY = "apple_assistant_chat";
export const SUGGESTIONS_PREFIX = "Suggestions:";

export const assistantImageTypes: AssistantImageType[] = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const assistantStarters = [
  "Which iPhone has the best camera under $1,000?",
  "I need a light laptop for university",
  "Compare iPad Air and iPad Pro",
  "Where is my latest order?",
];

export const productStarters = [
  "Is it good for gaming?",
  "How long does the battery last?",
  "Which storage should I choose?",
  "How does it compare to similar models?",
];

export const toolStatusLabels: Record<string, string> = {
  search_products: "Searching the catalog",
  get_product_details: "Checking product details",
  get_my_orders: "Looking up your orders",
  get_store_info: "Checking store policies",
  cancel_order: "Cancelling your order",
  request_return: "Requesting your return",
};

export const VOICE_LANGUAGE_STORAGE_KEY = "apple_voice_language";

export const voiceLanguages = [
  { value: "en-US", label: "English" },
  { value: "hi-IN", label: "हिन्दी" },
  { value: "ur-PK", label: "اردو" },
];

export const adminToolLabels: Record<string, string> = {
  search_products: "Searched the catalog",
  get_product_details: "Checked product details",
  get_my_orders: "Looked up orders",
  cancel_order: "Cancel order",
  request_return: "Return request",
  get_store_info: "Checked store policies",
};
