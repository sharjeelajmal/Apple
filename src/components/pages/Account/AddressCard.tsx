"use client";

import { useTransition } from "react";
import { MapPin } from "lucide-react";
import { countriesData } from "@/data/countries";
import { deleteAddress, setDefaultAddress } from "@/actions/addressActions";
import type { Address } from "@/types/address";

interface AddressCardProps {
  address: Address;
  onEdit: () => void;
}

export default function AddressCard({ address, onEdit }: AddressCardProps) {
  const [isPending, startTransition] = useTransition();
  const countryName = countriesData[address.country as keyof typeof countriesData]?.name ?? address.country;

  const actions = [
    { label: "Edit", onClick: onEdit, className: "text-accent" },
    ...(!address.isDefault
      ? [{ label: "Set as default", onClick: () => startTransition(() => setDefaultAddress(address.id)), className: "text-accent" }]
      : []),
    { label: "Remove", onClick: () => startTransition(() => deleteAddress(address.id)), className: "text-danger" },
  ];

  return (
    <article
      className={`flex flex-col rounded-card border bg-surface p-5 shadow-soft transition-opacity md:p-6 ${
        address.isDefault ? "border-accent" : "border-line-light"
      } ${isPending ? "opacity-60" : ""}`}
    >
      <div className="flex items-center gap-2">
        <MapPin size={18} className="text-ink-muted" />
        <h3 className="text-[17px] font-semibold text-ink">{address.label}</h3>
        {address.isDefault && (
          <span className="ml-auto rounded-full bg-accent/10 px-3 py-1 text-[12px] font-semibold text-accent">
            Default
          </span>
        )}
      </div>

      <address className="mt-4 flex-1 text-[15px] not-italic leading-relaxed text-ink-muted">
        <span className="block font-medium text-ink">{address.fullName}</span>
        {address.street}
        <br />
        {[address.city, address.state, address.postalCode].filter(Boolean).join(", ")}
        <br />
        {countryName}
        {address.phone && <span className="mt-1 block">{address.phone}</span>}
      </address>

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-line-light pt-4 text-[14px]">
        {actions.map(({ label, onClick, className }) => (
          <button key={label} type="button" disabled={isPending} onClick={onClick} className={`hover:underline ${className}`}>
            {label}
          </button>
        ))}
      </div>
    </article>
  );
}
