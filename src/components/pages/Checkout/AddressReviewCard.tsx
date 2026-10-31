import { TriangleAlert } from "lucide-react";
import AiBadge from "@/components/ai/AiBadge";
import type { OrderAddress } from "@/types/order";

type SuggestedAddress = Omit<OrderAddress, "country">;

type AddressReviewCardProps = {
  issues: string[];
  current: OrderAddress;
  suggested: SuggestedAddress;
  onUseSuggested: () => void;
  onKeepMine: () => void;
};

const formatAddress = ({ street, apartment, city, state, postalCode }: SuggestedAddress) =>
  [street, apartment, [city, state, postalCode].filter(Boolean).join(", ")].filter(Boolean);

export default function AddressReviewCard({ issues, current, suggested, onUseSuggested, onKeepMine }: AddressReviewCardProps) {
  return (
    <div role="alert" className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-[16px] font-semibold text-ink">
          <TriangleAlert size={18} className="text-amber-600" />
          Please double-check your address
        </p>
        <AiBadge label="AI address check" />
      </div>
      <ul className="mt-3 flex list-disc flex-col gap-1 pl-5 text-[14px] text-ink">
        {issues.map((issue) => (
          <li key={issue}>{issue}</li>
        ))}
      </ul>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {[
          { label: "You entered", lines: formatAddress(current) },
          { label: "Suggested", lines: formatAddress(suggested) },
        ].map(({ label, lines }) => (
          <div key={label} className="rounded-field bg-surface p-4 text-[14px]">
            <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-ink-muted">{label}</p>
            {lines.map((line) => (
              <p key={line} className="text-ink">
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onUseSuggested}
          className="rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-white hover:bg-black"
        >
          Use suggested address
        </button>
        <button
          type="button"
          onClick={onKeepMine}
          className="rounded-full border border-line bg-surface px-5 py-2.5 text-[14px] font-medium text-ink hover:border-ink"
        >
          Keep mine and continue
        </button>
      </div>
    </div>
  );
}
