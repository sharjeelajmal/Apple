import { useMemo, useSyncExternalStore } from "react";
import { parseOrder, readLastOrder } from "@/services/orderService";

const subscribe = () => () => {};
const getServerSnapshot = () => undefined;

export default function useLastOrder() {
  const raw = useSyncExternalStore(subscribe, readLastOrder, getServerSnapshot);
  const order = useMemo(() => (raw === undefined ? null : parseOrder(raw)), [raw]);

  return { order, isLoaded: raw !== undefined };
}
