"use client";

import { CreditCard, Lock } from "lucide-react";
import MonthYearPicker from "@/components/ui/calendar/MonthYearPicker";
import {
  detectCardBrand,
  formatCardNumber,
  getFormattedCardLength,
  getMaxCardLength,
  onlyDigits,
} from "@/lib/checkout/cardValidation";
import CheckoutField, { checkoutControlClass, FieldError } from "./CheckoutField";

export type CardFormValues = {
  number: string;
  expiry: string;
  cvc: string;
  holderName: string;
};

export type CardFormErrors = Partial<Record<keyof CardFormValues, string>>;

interface CardDetailsFormProps {
  value: CardFormValues;
  errors: CardFormErrors;
  onChange: (patch: Partial<CardFormValues>) => void;
}

export default function CardDetailsForm({ value, errors, onChange }: CardDetailsFormProps) {
  const brand = detectCardBrand(value.number);

  const handleNumberChange = (input: string) => {
    const digits = onlyDigits(input);
    const nextBrand = detectCardBrand(digits);
    onChange({
      number: digits.slice(0, getMaxCardLength(nextBrand)),
      cvc: value.cvc.slice(0, nextBrand.cvcLength),
    });
  };

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 p-1 md:grid-cols-2">
      <CheckoutField
        containerClassName="md:col-span-2"
        placeholder="Card Number"
        inputMode="numeric"
        autoComplete="cc-number"
        value={formatCardNumber(value.number, brand)}
        maxLength={getFormattedCardLength(brand)}
        error={errors.number}
        leading={<CreditCard size={20} />}
        trailing={
          value.number && brand.id !== "unknown" ? (
            <span className="rounded-md bg-surface px-2 py-1 text-[12px] font-semibold text-ink shadow-sm">{brand.name}</span>
          ) : undefined
        }
        onChange={(event) => handleNumberChange(event.target.value)}
      />
      <div className="flex flex-col">
        <MonthYearPicker
          label="Expiration date"
          placeholder="Expiration (MM / YY)"
          value={value.expiry}
          onChange={(expiry) => onChange({ expiry })}
          buttonClassName={checkoutControlClass(Boolean(errors.expiry))}
        />
        <FieldError message={errors.expiry} />
      </div>
      <CheckoutField
        placeholder={`Security Code (${brand.cvcLength} digits)`}
        inputMode="numeric"
        autoComplete="cc-csc"
        type="password"
        value={value.cvc}
        maxLength={brand.cvcLength}
        error={errors.cvc}
        trailing={<Lock size={16} className="text-ink-subtle" />}
        onChange={(event) => onChange({ cvc: onlyDigits(event.target.value).slice(0, brand.cvcLength) })}
      />
      <CheckoutField
        containerClassName="md:col-span-2"
        placeholder="Name on Card"
        autoComplete="cc-name"
        value={value.holderName}
        error={errors.holderName}
        onChange={(event) => onChange({ holderName: event.target.value })}
      />
    </div>
  );
}
