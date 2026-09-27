import type { ReactNode } from "react";
import { CreditCard } from "lucide-react";
import { FaCcMastercard, FaCcVisa } from "react-icons/fa";
import type { PaymentMethod } from "@/types/order";

const methods: { id: PaymentMethod; label: string; icon: ReactNode }[] = [
  { id: "visa", label: "Visa", icon: <FaCcVisa size={30} className="text-[#1a1f71]" /> },
  { id: "mastercard", label: "Mastercard", icon: <FaCcMastercard size={30} className="text-[#eb001b]" /> },
  { id: "card", label: "Other Credit or Debit Card", icon: <CreditCard className="text-ink" size={24} /> },
  {
    id: "paypal",
    label: "PayPal",
    icon: <span className="flex h-6 w-6 items-center justify-center rounded bg-[#003087] text-[12px] font-bold italic text-white">P</span>,
  },
  {
    id: "googlepay",
    label: "Google Pay",
    icon: <span className="flex h-6 w-6 items-center justify-center rounded border border-line bg-surface text-[12px] font-bold text-ink">G</span>,
  },
];

interface PaymentMethodOptionsProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export default function PaymentMethodOptions({ value, onChange }: PaymentMethodOptionsProps) {
  return (
    <div className="mb-8 flex flex-col gap-4">
      {methods.map(({ id, label, icon }) => (
        <label
          key={id}
          className={`flex cursor-pointer items-center rounded-xl border-2 p-4 transition-all ${
            value === id ? "border-accent bg-surface-muted" : "border-line hover:border-ink-subtle"
          }`}
        >
          <input
            type="radio"
            name="payment"
            checked={value === id}
            onChange={() => onChange(id)}
            className="h-5 w-5 accent-accent"
          />
          <span className="ml-4 flex items-center gap-3">
            <span className="flex w-8 justify-center">{icon}</span>
            <span className="text-[17px] font-semibold text-ink">{label}</span>
          </span>
        </label>
      ))}
    </div>
  );
}
