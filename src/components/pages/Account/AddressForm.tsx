"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import FloatingField from "@/components/ui/FloatingField";
import FormAlert from "@/components/ui/FormAlert";
import Spinner from "@/components/ui/Spinner";
import CustomDropdown from "@/components/shared/CustomDropdown";
import { countriesData, countryOptions } from "@/data/countries";
import { saveAddress } from "@/actions/addressActions";
import { sanitizers } from "@/lib/checkout/addressValidation";
import type { Address, AddressInput } from "@/types/address";

type CountryCode = keyof typeof countriesData;

const emptyAddress: AddressInput = {
  label: "Home",
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
};

const dropdownButtonClass =
  "flex h-14 w-full items-center justify-between rounded-field border border-line bg-surface px-4 text-[17px] text-ink outline-none transition-all focus:border-accent focus:ring-4 focus:ring-accent/15";

interface AddressFormProps {
  address?: Address;
  onDone: () => void;
}

export default function AddressForm({ address, onDone }: AddressFormProps) {
  const [values, setValues] = useState<AddressInput>(address ?? emptyAddress);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const stateOptions = countriesData[values.country as CountryCode]?.states ?? [];

  const updateField = (name: keyof AddressInput, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const fieldSanitizers: Partial<Record<keyof AddressInput, (value: string) => string>> = {
    fullName: sanitizers.name,
    phone: sanitizers.phone,
    street: sanitizers.street,
    city: sanitizers.city,
    postalCode: (value) => sanitizers.postalCode(value, values.country),
  };

  const fieldProps = (name: keyof AddressInput) => ({
    name,
    value: values[name],
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      updateField(name, fieldSanitizers[name]?.(event.target.value) ?? event.target.value),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await saveAddress(values, address?.id);
      if (result.error) {
        setError(result.error);
        return;
      }
      onDone();
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      <FormAlert message={error} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FloatingField label="Label (e.g. Home, Work)" {...fieldProps("label")} />
        <FloatingField label="Full Name" autoComplete="name" {...fieldProps("fullName")} />
        <FloatingField label="Street Address" autoComplete="street-address" className="sm:col-span-2" {...fieldProps("street")} />
        <FloatingField label="City" autoComplete="address-level2" {...fieldProps("city")} />
        <FloatingField label="ZIP / Postal Code" autoComplete="postal-code" {...fieldProps("postalCode")} />
        <CustomDropdown
          options={countryOptions}
          value={values.country}
          onChange={(country) => setValues((prev) => ({ ...prev, country, state: "", postalCode: "" }))}
          placeholder="Country"
          buttonClassName={dropdownButtonClass}
        />
        {stateOptions.length ? (
          <CustomDropdown
            options={stateOptions}
            value={values.state}
            onChange={(state) => updateField("state", state)}
            placeholder="State / Province"
            buttonClassName={dropdownButtonClass}
          />
        ) : (
          <FloatingField label="State / Province" autoComplete="address-level1" {...fieldProps("state")} />
        )}
        <FloatingField label="Phone" type="tel" autoComplete="tel" className="sm:col-span-2" {...fieldProps("phone")} />
      </div>

      <div className="mt-3 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onDone}
          className="h-11 rounded-full px-6 text-[15px] text-accent hover:underline"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 text-[15px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-70"
        >
          {isPending && <Spinner className="h-4 w-4" />}
          {address ? "Save Changes" : "Add Address"}
        </button>
      </div>
    </form>
  );
}
