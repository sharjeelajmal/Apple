"use server";

import { headers } from "next/headers";
import { ASSISTANT_IMAGE_MAX_BYTES, assistantImageTypes } from "@/config/assistant";
import type { CartItem } from "@/context/CartContext";
import { toAiErrorMessage } from "@/lib/ai/client";
import { adviseCart, reviewAddress, type AddressReview, type CartTip } from "@/lib/ai/features/checkoutHelpers";
import { searchByImage } from "@/lib/ai/features/imageSearch";
import {
  adviseUpgrade,
  findGifts,
  recommendForShopper,
  type GiftRequest,
  type UpgradeAdvice,
  type UpgradeRequest,
} from "@/lib/ai/features/shoppingAdvisors";
import { getProductsByHandles, toCardProduct } from "@/lib/catalog";
import { getOrdersForUser } from "@/lib/orders";
import { createRateLimiter } from "@/lib/rateLimit";
import { getSession } from "@/lib/session";
import { getWishlistForUser } from "@/lib/wishlist";
import type { AssistantImage } from "@/types/assistant";
import type { CatalogProduct, ProductCardData } from "@/types/catalog";
import type { OrderAddress } from "@/types/order";

export type AiResult<T> = { data: T; error?: never } | { data?: never; error: string };
export type AiPick = { product: ProductCardData; reason: string };

const failure = (error: string): { data?: never; error: string } => ({ error });

const isAllowed = createRateLimiter({ requests: 60, windowMs: 10 * 60 * 1000 });
const MAX_TEXT = 200;
const MAX_RECENT = 8;
const MAX_CART_ITEMS = 20;
const MAX_BASE64_LENGTH = Math.ceil((ASSISTANT_IMAGE_MAX_BYTES * 4) / 3);

const text = (value: unknown, max = MAX_TEXT) => (typeof value === "string" ? value.trim().slice(0, max) : "");
const toPicks = (picks: { product: CatalogProduct; reason: string }[]): AiPick[] =>
  picks.map(({ product, reason }) => ({ product: toCardProduct(product), reason }));

async function runAi<T>(task: () => Promise<T>): Promise<AiResult<T>> {
  const requestHeaders = await headers();
  const clientKey = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!isAllowed(clientKey)) return failure("Too many AI requests. Please wait a few minutes.");

  try {
    return { data: await task() };
  } catch (error) {
    console.error("AI action failed", error);
    return failure(toAiErrorMessage(error));
  }
}

export async function searchProductsByPhoto(image: AssistantImage) {
  if (!assistantImageTypes.includes(image?.mediaType) || typeof image.data !== "string" || image.data.length > MAX_BASE64_LENGTH) {
    return failure("Please upload a JPG, PNG, WebP or GIF photo.");
  }

  return runAi(async () => {
    const result = await searchByImage({ mediaType: image.mediaType, data: image.data });
    return { description: result.description, matches: toPicks(result.matches) };
  });
}

export async function getPersonalRecommendations(recentHandles: string[]) {
  return runAi(async () => {
    const session = await getSession();
    const recentlyViewed = await getProductsByHandles(recentHandles.slice(0, MAX_RECENT).map((handle) => text(handle)));
    const [orders, wishlist] = session
      ? await Promise.all([
          getOrdersForUser(session.user.id),
          getWishlistForUser(session.user.id),
        ])
      : [[], []];

    const result = await recommendForShopper(
      {
        purchased: [...new Set(orders.filter((order) => order.status !== "cancelled").flatMap((order) => order.items.map((item) => item.title)))],
        wishlist: wishlist.map((item) => item.title),
        recentlyViewed: recentlyViewed.map((product) => product.title),
      },
      session?.user.id ?? "guest"
    );
    return result && { headline: result.headline, picks: toPicks(result.picks) };
  });
}

export async function getGiftIdeas(input: GiftRequest) {
  const budget = Number(input?.budget);
  if (!Number.isFinite(budget) || budget < 50 || budget > 10000) return failure("Please choose a budget between $50 and $10,000.");

  return runAi(async () => {
    const result = await findGifts({
      recipient: text(input.recipient) || "someone special",
      occasion: text(input.occasion) || "any occasion",
      budget,
      interests: (Array.isArray(input.interests) ? input.interests : []).slice(0, 8).map((interest) => text(interest, 40)),
      note: text(input.note, 300),
    });
    return { intro: result.intro, picks: toPicks(result.picks) };
  });
}

export async function getUpgradeAdvice(input: UpgradeRequest) {
  const currentDevice = text(input?.currentDevice, 80);
  if (currentDevice.length < 3) return failure("Tell us which device you have now, e.g. iPhone 13.");
  const budget = Number(input.budget);

  return runAi(async (): Promise<Omit<UpgradeAdvice, "picks"> & { picks: AiPick[] }> => {
    const advice = await adviseUpgrade({
      currentDevice,
      priorities: (Array.isArray(input.priorities) ? input.priorities : []).slice(0, 6).map((priority) => text(priority, 40)),
      budget: Number.isFinite(budget) && budget > 0 ? budget : null,
    });
    return { ...advice, picks: toPicks(advice.picks) };
  });
}

export async function getCartAdvice(items: CartItem[]) {
  if (!Array.isArray(items) || !items.length) return failure("Your bag is empty.");

  return runAi(async () => {
    const cart = items.slice(0, MAX_CART_ITEMS).map((item) => ({
      ...item,
      title: text(item.title),
      quantity: Math.max(1, Math.min(99, Number(item.quantity) || 1)),
      price: Number(item.price) || 0,
    }));
    const advice = await adviseCart(cart);
    return {
      summary: advice.summary,
      tips: advice.tips.map((tip): Omit<CartTip, "handle"> & { product: ProductCardData | null } => ({
        kind: tip.kind,
        message: tip.message,
        product: tip.product ? toCardProduct(tip.product) : null,
      })),
    };
  });
}

export async function checkShippingAddress(address: OrderAddress): Promise<AiResult<AddressReview>> {
  return runAi(() =>
    reviewAddress({
      street: text(address?.street),
      apartment: text(address?.apartment),
      city: text(address?.city, 80),
      state: text(address?.state, 80),
      postalCode: text(address?.postalCode, 20),
      country: text(address?.country, 4),
    })
  );
}
