export type CompareItem = {
  handle: string;
  title: string;
  image: string;
};

export const MAX_COMPARE_ITEMS = 3;
const STORAGE_KEY = "apple_compare_list";
const CHANGE_EVENT = "compare-list-change";

export const readCompareRaw = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
};

export const parseCompareList = (raw: string): CompareItem[] => {
  try {
    const items = JSON.parse(raw);
    return Array.isArray(items) ? items.filter((item) => typeof item?.handle === "string") : [];
  } catch {
    return [];
  }
};

export const subscribeToCompareList = (onChange: () => void) => {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
};

const write = (items: CompareItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

export const toggleCompareItem = (item: CompareItem) => {
  const items = parseCompareList(readCompareRaw());
  if (items.some((existing) => existing.handle === item.handle)) {
    write(items.filter((existing) => existing.handle !== item.handle));
    return true;
  }
  if (items.length >= MAX_COMPARE_ITEMS) return false;
  write([...items, item]);
  return true;
};

export const removeCompareItem = (handle: string) =>
  write(parseCompareList(readCompareRaw()).filter((item) => item.handle !== handle));

export const clearCompareList = () => write([]);

export const comparePageHref = (handles: string[]) => `/compare?items=${handles.map(encodeURIComponent).join(",")}`;
