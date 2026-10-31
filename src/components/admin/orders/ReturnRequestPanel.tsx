"use client";

import { useTransition } from "react";
import { resolveReturn } from "@/actions/admin/orderActions";
import ReturnBadge from "@/components/shared/order/ReturnBadge";
import { formatLongDate } from "@/lib/format";
import type { ReturnRequest } from "@/types/order";

type ReturnRequestPanelProps = {
  orderNumber: string;
  request: ReturnRequest;
};

export default function ReturnRequestPanel({ orderNumber, request }: ReturnRequestPanelProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-line-light bg-amber-50/40 px-5 py-3 text-[14px]">
      <ReturnBadge status={request.status} />
      <span className="min-w-0 flex-1 text-ink-muted">
        {formatLongDate(request.requestedAt)}: “{request.reason || "No reason given"}”
      </span>
      {request.status === "requested" && (
        <div className="flex gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => resolveReturn(orderNumber, true))}
            className="h-8 rounded-full bg-ink px-4 text-[13px] font-medium text-white hover:bg-black disabled:opacity-50"
          >
            Approve
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => resolveReturn(orderNumber, false))}
            className="h-8 rounded-full border border-line px-4 text-[13px] text-ink hover:border-danger hover:text-danger disabled:opacity-50"
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
}
