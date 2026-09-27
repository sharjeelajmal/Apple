"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import FormAlert from "@/components/ui/FormAlert";
import Spinner from "@/components/ui/Spinner";
import { useCart } from "@/context/CartContext";
import { detectCardBrand, formatCardNumber, onlyDigits, validateCardForm, type CardBrandId } from "@/lib/checkout/cardValidation";
import { validateAddress } from "@/lib/checkout/validateAddress";
import { clearShippingDetails, emptyAddress, type ShippingDetails } from "@/services/checkoutStorage";
import { placeOrder } from "@/services/orderService";
import { isCardPayment, type CardSummary, type OrderAddress, type PaymentMethod } from "@/types/order";
import AddressFields, { getStateOptions, type AddressErrors } from "./AddressFields";
import CardDetailsForm, { type CardFormErrors, type CardFormValues } from "./CardDetailsForm";
import PaymentMethodOptions from "./PaymentMethodOptions";

const LAST_DIGITS = 4;

const emptyCard: CardFormValues = { number: "", expiry: "", cvc: "", holderName: "" };

const expand = { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 } };

const brandPaymentMethods: Partial<Record<CardBrandId, PaymentMethod>> = {
  visa: "visa",
  mastercard: "mastercard",
};

const getCardMethod = (cardNumber: string): PaymentMethod => brandPaymentMethods[detectCardBrand(cardNumber).id] ?? "card";

const toCardSummary = (card: CardFormValues): CardSummary => {
  const digits = onlyDigits(card.number);
  const brand = detectCardBrand(digits);
  return {
    brand: brand.name,
    cardNumber: formatCardNumber(digits, brand),
    last4: digits.slice(-LAST_DIGITS),
    expiry: card.expiry,
    holderName: card.holderName.trim(),
  };
};

export default function PaymentForm({ shipping }: { shipping: ShippingDetails }) {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("visa");
  const [card, setCard] = useState(emptyCard);
  const [cardErrors, setCardErrors] = useState<CardFormErrors>({});
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billing, setBilling] = useState<OrderAddress>(() => emptyAddress(shipping.address.country));
  const [billingErrors, setBillingErrors] = useState<AddressErrors>({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  const isCard = isCardPayment(paymentMethod);
  const usesSeparateBilling = isCard && !billingSameAsShipping;

  const updateCard = (patch: Partial<CardFormValues>) => {
    setCard((prev) => ({ ...prev, ...patch }));
    if (patch.number) setPaymentMethod(getCardMethod(patch.number));
    setCardErrors((prev) => ({ ...prev, ...Object.fromEntries(Object.keys(patch).map((key) => [key, ""])) }));
  };

  const updateBilling = (patch: Partial<OrderAddress>) => {
    setBilling((prev) => ({ ...prev, ...patch }));
    setBillingErrors((prev) => ({ ...prev, ...Object.fromEntries(Object.keys(patch).map((key) => [key, ""])) }));
  };

  const validate = () => {
    const nextCardErrors = isCard ? validateCardForm(card) : {};
    if (isCard && !nextCardErrors.number && getCardMethod(card.number) !== paymentMethod) {
      nextCardErrors.number = `This is a ${detectCardBrand(card.number).name} card. Please choose the matching option above.`;
    }
    const nextBillingErrors = usesSeparateBilling ? validateAddress(billing, getStateOptions(billing.country).length > 0) : {};
    setCardErrors(nextCardErrors);
    setBillingErrors(nextBillingErrors);
    return !Object.keys(nextCardErrors).length && !Object.keys(nextBillingErrors).length;
  };

  const handlePlaceOrder = async () => {
    setOrderError("");
    if (!validate()) return;

    setIsPlacingOrder(true);
    try {
      const { error } = await placeOrder(cartItems, {
        contact: shipping.contact,
        shippingAddress: shipping.address,
        billingAddress: usesSeparateBilling ? billing : shipping.address,
        paymentMethod,
        card: isCard ? toCardSummary(card) : null,
      });

      if (error) {
        setOrderError(error);
        setIsPlacingOrder(false);
        return;
      }

      router.push("/checkout/confirmation");
      clearCart();
      clearShippingDetails();
    } catch {
      setOrderError("We couldn't place your order. Please try again.");
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="rounded-2xl border border-line-light bg-surface p-6 shadow-sm md:p-8">
      <PaymentMethodOptions value={paymentMethod} onChange={setPaymentMethod} />

      <AnimatePresence>
        {isCard && (
          <motion.div {...expand} className="overflow-hidden">
            <CardDetailsForm value={card} errors={cardErrors} onChange={updateCard} />

            <div className="mb-8 border-t border-line pt-6">
              <h3 className="mb-4 flex items-center gap-2 text-[19px] font-semibold text-ink">
                <Building2 size={20} />
                Billing Address
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Same as shipping address", checked: billingSameAsShipping, value: true },
                  { label: "Use a different billing address", checked: !billingSameAsShipping, value: false },
                ].map((option) => (
                  <label key={option.label} className="group flex cursor-pointer items-center">
                    <input
                      type="radio"
                      name="billing"
                      checked={option.checked}
                      onChange={() => setBillingSameAsShipping(option.value)}
                      className="h-4 w-4 accent-accent"
                    />
                    <span className="ml-3 text-[15px] text-ink transition-colors group-hover:text-accent">{option.label}</span>
                  </label>
                ))}
              </div>

              <AnimatePresence>
                {!billingSameAsShipping && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden p-1"
                  >
                    <AddressFields value={billing} errors={billingErrors} onChange={updateBilling} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {orderError && (
        <div className="mb-6">
          <FormAlert message={orderError} />
        </div>
      )}

      <div className="flex flex-col items-center justify-between gap-6 border-t border-line pt-6 sm:flex-row">
        <div className="flex items-center gap-2 text-[14px] text-ink-muted">
          <ShieldCheck size={20} className="text-positive" />
          Your payment information is encrypted and secure.
        </div>
        <Button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className="h-[54px] w-full gap-2 rounded-full px-10 text-[17px] font-medium sm:w-auto"
        >
          {isPlacingOrder && <Spinner className="h-4 w-4" />}
          {isPlacingOrder ? "Placing Order..." : "Place Order"}
        </Button>
      </div>
    </div>
  );
}
