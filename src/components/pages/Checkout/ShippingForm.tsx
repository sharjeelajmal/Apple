"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { checkShippingAddress } from "@/actions/aiActions";
import { Button } from "@/components/ui/Button";
import type { AddressReview } from "@/lib/ai/features/checkoutHelpers";
import { fieldLimits, sanitizers } from "@/lib/checkout/addressValidation";
import { validateAddress, validateContact } from "@/lib/checkout/validateAddress";
import { emptyAddress, emptyContact, readShippingDetails, saveShippingDetails } from "@/services/checkoutStorage";
import type { CheckoutContact, OrderAddress } from "@/types/order";
import AddressFields, { getStateOptions, type AddressErrors } from "./AddressFields";
import AddressReviewCard from "./AddressReviewCard";
import CheckoutField from "./CheckoutField";

type ContactErrors = Partial<Record<keyof CheckoutContact, string>>;

export default function ShippingForm({ checkAddressWithAi }: { checkAddressWithAi: boolean }) {
  const router = useRouter();
  const [contact, setContact] = useState<CheckoutContact>(() => readShippingDetails()?.contact ?? emptyContact);
  const [address, setAddress] = useState<OrderAddress>(() => readShippingDetails()?.address ?? emptyAddress());
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
  const [addressErrors, setAddressErrors] = useState<AddressErrors>({});
  const [addressReview, setAddressReview] = useState<AddressReview | null>(null);
  const [isCheckingAddress, startAddressCheck] = useTransition();

  const updateContact = (patch: Partial<CheckoutContact>) => {
    setContact((prev) => ({ ...prev, ...patch }));
    setContactErrors((prev) => ({ ...prev, ...Object.fromEntries(Object.keys(patch).map((key) => [key, ""])) }));
  };

  const updateAddress = (patch: Partial<OrderAddress>) => {
    setAddressReview(null);
    setAddress((prev) => ({ ...prev, ...patch }));
    setAddressErrors((prev) => ({ ...prev, ...Object.fromEntries(Object.keys(patch).map((key) => [key, ""])) }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextContactErrors = validateContact(contact);
    const nextAddressErrors = validateAddress(address, getStateOptions(address.country).length > 0);
    setContactErrors(nextContactErrors);
    setAddressErrors(nextAddressErrors);

    if (Object.keys(nextContactErrors).length || Object.keys(nextAddressErrors).length) return;

    if (!checkAddressWithAi) {
      continueToPayment(address);
      return;
    }

    startAddressCheck(async () => {
      const result = await checkShippingAddress(address);
      if (result.data?.status === "needs_attention" && result.data.issues.length) {
        setAddressReview(result.data);
      } else {
        continueToPayment(address);
      }
    });
  };

  const continueToPayment = (finalAddress: OrderAddress) => {
    saveShippingDetails({ contact, address: finalAddress });
    router.push("/checkout/payment");
  };

  const useSuggestedAddress = () => {
    if (!addressReview) return;
    const suggested = { ...addressReview.suggested, country: address.country };
    setAddress(suggested);
    continueToPayment(suggested);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-line-light bg-surface p-6 shadow-sm md:p-8">
      <h3 className="mb-6 text-[19px] font-semibold text-ink">Contact Information</h3>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <CheckoutField
          placeholder="First Name"
          autoComplete="given-name"
          value={contact.firstName}
          error={contactErrors.firstName}
          maxLength={fieldLimits.name}
          onChange={(event) => updateContact({ firstName: sanitizers.name(event.target.value) })}
        />
        <CheckoutField
          placeholder="Last Name"
          autoComplete="family-name"
          value={contact.lastName}
          error={contactErrors.lastName}
          maxLength={fieldLimits.name}
          onChange={(event) => updateContact({ lastName: sanitizers.name(event.target.value) })}
        />
        <CheckoutField
          containerClassName="md:col-span-2"
          type="email"
          placeholder="Email Address"
          autoComplete="email"
          value={contact.email}
          error={contactErrors.email}
          onChange={(event) => updateContact({ email: sanitizers.email(event.target.value) })}
        />
        <CheckoutField
          containerClassName="md:col-span-2"
          type="tel"
          inputMode="tel"
          placeholder="Phone Number"
          autoComplete="tel"
          value={contact.phone}
          error={contactErrors.phone}
          maxLength={fieldLimits.phone}
          onChange={(event) => updateContact({ phone: sanitizers.phone(event.target.value) })}
        />
      </div>

      <h3 className="mb-6 mt-10 text-[19px] font-semibold text-ink">Shipping Address</h3>
      <AddressFields value={address} errors={addressErrors} onChange={updateAddress} />

      {addressReview && (
        <AddressReviewCard
          issues={addressReview.issues}
          current={address}
          suggested={addressReview.suggested}
          onUseSuggested={useSuggestedAddress}
          onKeepMine={() => continueToPayment(address)}
        />
      )}

      <div className="mt-8 flex justify-end border-t border-line pt-6">
        <Button
          type="submit"
          disabled={isCheckingAddress}
          className="h-[54px] w-full rounded-full px-8 text-[17px] font-medium md:w-auto"
        >
          {isCheckingAddress ? "Checking address…" : "Continue to Payment"}
        </Button>
      </div>
    </form>
  );
}
