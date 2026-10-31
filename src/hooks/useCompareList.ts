import { useMemo, useSyncExternalStore } from "react";
import { parseCompareList, readCompareRaw, subscribeToCompareList } from "@/lib/compareList";

export default function useCompareList() {
  const raw = useSyncExternalStore(subscribeToCompareList, readCompareRaw, () => "[]");
  return useMemo(() => parseCompareList(raw), [raw]);
}
