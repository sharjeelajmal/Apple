import type { CartItem } from "@/context/CartContext";
import { formatPrice, resolveImageUrl } from "@/lib/format";

interface OrderItemsListProps {
  items: CartItem[];
}

export default function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <ul className="divide-y divide-line-light">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-4 py-5 first:pt-0 last:pb-0">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-field bg-surface-muted p-2">
            <img
              src={resolveImageUrl(item.image)}
              alt={item.title}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[15px] font-semibold text-ink sm:text-[17px]">{item.title}</h3>
            {item.variant?.colorName && (
              <p className="truncate text-[13px] text-ink-muted">
                {[item.variant.storage, item.variant.colorName].filter(Boolean).join(" · ")}
              </p>
            )}
            <p className="text-[13px] text-ink-muted">Qty {item.quantity}</p>
          </div>
          <p className="shrink-0 text-[15px] font-semibold text-ink sm:text-[17px]">
            {formatPrice(item.price * item.quantity)}
          </p>
        </li>
      ))}
    </ul>
  );
}
