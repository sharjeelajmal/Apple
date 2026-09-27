"use client";

import CustomDropdown from "@/components/shared/CustomDropdown";
import { countriesData, countryOptions } from "@/data/countries";
import { getPostalRule, isPostalCodeRequired, sanitizers } from "@/lib/checkout/addressValidation";
import type { OrderAddress } from "@/types/order";
import CheckoutField, { checkoutControlClass, FieldError } from "./CheckoutField";

export type AddressErrors = Partial<Record<keyof OrderAddress, string>>;

type CountryCode = keyof typeof countriesData;

export const getStateOptions = (country: string) => countriesData[country as CountryCode]?.states ?? [];

interface AddressFieldsProps {
  value: OrderAddress;
  errors: AddressErrors;
  onChange: (patch: Partial<OrderAddress>) => void;
  showCountry?: boolean;
}

export default function AddressFields({ value, errors, onChange, showCountry = true }: AddressFieldsProps) {
  const stateOptions = getStateOptions(value.country);
  const postalRule = getPostalRule(value.country);
  const postalRequired = isPostalCodeRequired(value.country);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <CheckoutField
        containerClassName="md:col-span-2"
        placeholder="Street Address"
        autoComplete="address-line1"
        value={value.street}
        error={errors.street}
        maxLength={100}
        onChange={(event) => onChange({ street: sanitizers.street(event.target.value) })}
      />
      <CheckoutField
        containerClassName="md:col-span-2"
        placeholder="Apt, Suite, Building (Optional)"
        autoComplete="address-line2"
        value={value.apartment}
        maxLength={60}
        onChange={(event) => onChange({ apartment: sanitizers.apartment(event.target.value) })}
      />
      <CheckoutField
        placeholder="City"
        autoComplete="address-level2"
        value={value.city}
        error={errors.city}
        onChange={(event) => onChange({ city: sanitizers.city(event.target.value) })}
      />
      {stateOptions.length > 0 && (
        <div className="flex flex-col">
          <CustomDropdown
            options={stateOptions}
            value={value.state}
            onChange={(state) => onChange({ state })}
            placeholder="State / Province"
            ariaLabel="State / Province"
            align="left"
            className="w-full"
            buttonClassName={checkoutControlClass(Boolean(errors.state))}
          />
          <FieldError message={errors.state} />
        </div>
      )}
      <CheckoutField
        placeholder={postalRequired ? `ZIP / Postal Code${postalRule.example ? ` (e.g. ${postalRule.example})` : ""}` : "Postal Code (Optional)"}
        autoComplete="postal-code"
        inputMode={postalRule.numeric ? "numeric" : "text"}
        value={value.postalCode}
        error={errors.postalCode}
        maxLength={postalRule.maxLength}
        onChange={(event) => onChange({ postalCode: sanitizers.postalCode(event.target.value, value.country) })}
      />
      {showCountry && (
        <CustomDropdown
          options={countryOptions}
          value={value.country}
          onChange={(country) => onChange({ country, state: "", postalCode: "" })}
          placeholder="Country"
          ariaLabel="Country"
          align="left"
          className="w-full"
          buttonClassName={checkoutControlClass(false)}
        />
      )}
    </div>
  );
}
