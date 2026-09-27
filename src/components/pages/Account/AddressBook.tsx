"use client";

import { useState } from "react";
import { MapPin, Plus } from "lucide-react";
import type { Address } from "@/types/address";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import EmptyState from "@/components/shared/dashboard/EmptyState";
import SectionCard from "@/components/shared/dashboard/SectionCard";

type EditorState = { mode: "closed" } | { mode: "create" } | { mode: "edit"; address: Address };

interface AddressBookProps {
  addresses: Address[];
}

export default function AddressBook({ addresses }: AddressBookProps) {
  const [editor, setEditor] = useState<EditorState>({ mode: "closed" });
  const closeEditor = () => setEditor({ mode: "closed" });

  if (editor.mode !== "closed") {
    const address = editor.mode === "edit" ? editor.address : undefined;

    return (
      <SectionCard
        title={address ? "Edit Address" : "New Address"}
        description="We'll use this for faster checkout and deliveries."
      >
        <AddressForm key={address?.id ?? "new"} address={address} onDone={closeEditor} />
      </SectionCard>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[15px] text-ink-muted">
          {addresses.length} saved {addresses.length === 1 ? "address" : "addresses"}
        </p>
        <button
          type="button"
          onClick={() => setEditor({ mode: "create" })}
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-accent-hover"
        >
          <Plus size={16} />
          Add Address
        </button>
      </div>

      {addresses.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => setEditor({ mode: "edit", address })}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MapPin}
          title="No saved addresses yet."
          description="Add a shipping address to speed through checkout next time."
        />
      )}
    </div>
  );
}
