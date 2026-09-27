import { Button } from "@/components/ui/Button";
import { formatDate, formatPrice } from "@/lib/format";
import { paymentMethodLabels, type Order } from "@/types/order";

interface OrderSummaryCardProps {
  order: Order;
}

export default function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  const rows = [
    { label: "Order date", value: formatDate(order.placedAt, { year: "numeric" }) },
    { label: "Payment", value: paymentMethodLabels[order.paymentMethod] },
    { label: "Subtotal", value: formatPrice(order.subtotal) },
    { label: "Shipping", value: "Free" },
  ];

  return (
    <div className="rounded-card border border-line-light bg-surface p-6 shadow-soft md:p-8">
      <h2 className="text-[21px] font-semibold tracking-tight text-ink">Order Summary</h2>

      <dl className="mt-6 flex flex-col gap-3 text-[15px]">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="text-ink-muted">{label}</dt>
            <dd className="text-right font-medium text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex items-center justify-between border-t border-line pt-6">
        <span className="text-[19px] font-semibold text-ink">Total</span>
        <span className="text-[24px] font-semibold text-ink">{formatPrice(order.subtotal)}</span>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Button href="/collections/all" className="h-[50px] w-full font-medium">
          Continue Shopping
        </Button>
        <Button href="/" variant="outline" className="h-[50px] w-full font-medium">
          Back to Home
        </Button>
      </div>
    </div>
  );
}
