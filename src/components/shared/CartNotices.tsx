"use client";

import { Info, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartNotices({ className = "" }: { className?: string }) {
  const { cartNotices, dismissCartNotices } = useCart();

  if (!cartNotices.length) return null;

  return (
    <div role="status" className={`flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-[14px] text-amber-900 ${className}`}>
      <Info size={18} className="mt-0.5 shrink-0" />
      <ul className="flex flex-1 flex-col gap-1">
        {cartNotices.map((notice) => (
          <li key={notice}>{notice}</li>
        ))}
      </ul>
      <button type="button" aria-label="Dismiss" onClick={dismissCartNotices} className="shrink-0 rounded-full p-1 hover:bg-amber-100">
        <X size={16} />
      </button>
    </div>
  );
}
