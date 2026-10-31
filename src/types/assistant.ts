import type { ProductCardData } from "@/types/catalog";

export type AssistantImageType = "image/jpeg" | "image/png" | "image/webp" | "image/gif";

export type AssistantImage = {
  mediaType: AssistantImageType;
  data: string;
};

export type ChatTurn = {
  role: "user" | "assistant";
  text: string;
  images?: AssistantImage[];
};

export type AssistantEvent =
  | { type: "text"; delta: string }
  | { type: "status"; label: string }
  | { type: "done"; products: ProductCardData[]; suggestions: string[] }
  | { type: "error"; message: string };
