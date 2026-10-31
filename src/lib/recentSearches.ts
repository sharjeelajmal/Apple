const STORAGE_KEY = "apple_recent_searches";
const CHANGE_EVENT = "recent-searches-change";
const MAX_ITEMS = 5;

export const POPULAR_SEARCHES = ["iPhone 18 Pro", "MacBook Air", "iPad Pro", "Apple Watch Ultra", "iPhone Duo"];

export const readRecentSearchesRaw = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
};

export const parseRecentSearches = (raw: string): string[] => {
  try {
    const items = JSON.parse(raw);
    return Array.isArray(items) ? items.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
};

export const subscribeToRecentSearches = (onChange: () => void) => {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
};

const write = (items: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {}
};

export const saveRecentSearch = (query: string) => {
  const value = query.trim();
  if (!value) return;
  const items = parseRecentSearches(readRecentSearchesRaw()).filter((item) => item.toLowerCase() !== value.toLowerCase());
  write([value, ...items].slice(0, MAX_ITEMS));
};

export const clearRecentSearches = () => write([]);
