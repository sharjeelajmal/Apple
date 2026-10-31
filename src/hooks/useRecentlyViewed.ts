import { useMemo, useSyncExternalStore } from "react";
import { parseRecentlyViewed, readRecentlyViewedRaw, subscribeToRecentlyViewed } from "@/lib/recentlyViewed";

const EMPTY = "[]";

export default function useRecentlyViewed(excludeId?: string) {
  const raw = useSyncExternalStore(subscribeToRecentlyViewed, readRecentlyViewedRaw, () => EMPTY);
  return useMemo(() => parseRecentlyViewed(raw).filter((item) => item.id !== excludeId), [raw, excludeId]);
}
