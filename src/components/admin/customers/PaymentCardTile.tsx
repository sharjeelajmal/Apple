import type { ReactNode } from "react";
import type { CardSummary } from "@/types/order";

interface PaymentCardTileProps {
  card: CardSummary;
  footer?: ReactNode;
}

export default function PaymentCardTile({ card, footer }: PaymentCardTileProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative isolate aspect-[1.586] w-full max-w-[320px] overflow-hidden rounded-[16px] bg-linear-to-br from-ink via-[#2c2c2e] to-[#48484a] p-5 text-white shadow-float">
        <div className="pointer-events-none absolute -right-10 -top-10 -z-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="flex h-full flex-col justify-between">
          <p className="text-[14px] font-semibold tracking-wide">{card.brand}</p>
          <p className="font-mono text-[19px] tracking-[0.18em]">{card.cardNumber || `•••• •••• •••• ${card.last4}`}</p>
          <div className="flex items-end justify-between gap-4 text-[12px]">
            <span>
              <span className="block text-white/60">Card holder</span>
              <span className="block truncate text-[14px] font-medium uppercase">{card.holderName || "—"}</span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block text-white/60">Expires</span>
              <span className="block text-[14px] font-medium">{card.expiry}</span>
            </span>
          </div>
        </div>
      </div>
      {footer}
    </div>
  );
}
