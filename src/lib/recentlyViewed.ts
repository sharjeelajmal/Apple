import type { ProductCardData } from "@/types/catalog";

const STORAGE_KEY = "apple_recently_viewed";
const CHANGE_EVENT = "recently-viewed-change";
const MAX_ITEMS = 12;

export const readRecentlyViewedRaw = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
};

export const parseRecentlyViewed = (raw: string): ProductCardData[] => {
  try {
    const items = JSON.parse(raw);
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
};

export const subscribeToRecentlyViewed = (onChange: () => void) => {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};

export const addRecentlyViewed = (product: ProductCardData) => {
  const items = parseRecentlyViewed(readRecentlyViewedRaw()).filter((item) => item.id !== product.id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([product, ...items].slice(0, MAX_ITEMS)));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {}
};
