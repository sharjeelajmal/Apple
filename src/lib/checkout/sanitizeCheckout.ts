import { countriesData } from "@/data/countries";
import { isCardPayment, paymentMethodLabels, type CardSummary, type CheckoutDetails, type OrderAddress, type PaymentMethod } from "@/types/order";
import { sanitizers } from "./addressValidation";
import { cardBrandNames, detectCardBrand, formatCardNumber, validateExpiry } from "./cardValidation";
import { validateAddress, validateContact } from "./validateAddress";

const PAYMENT_METHODS = Object.keys(paymentMethodLabels) as PaymentMethod[];

const requiredCardBrand: Partial<Record<PaymentMethod, string>> = {
  visa: "Visa",
  mastercard: "Mastercard",
};

const MAX_HOLDER_NAME = 60;

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const sanitizeAddress = (address: Partial<OrderAddress> | undefined): OrderAddress => {
  const country = text(address?.country) in countriesData ? text(address?.country) : "";
  return {
    street: sanitizers.street(text(address?.street)),
    apartment: sanitizers.apartment(text(address?.apartment)),
    city: sanitizers.city(text(address?.city)),
    state: text(address?.state),
    postalCode: sanitizers.postalCode(text(address?.postalCode), country),
    country,
  };
};

const hasStates = (country: string) => (countriesData[country as keyof typeof countriesData]?.states.length ?? 0) > 0;

const sanitizeCard = (card: Partial<CardSummary> | null | undefined): CardSummary | null => {
  if (!card) return null;
  const digits = text(card.cardNumber).replace(/\D/g, "");
  const brand = detectCardBrand(digits);
  const formattedCardNumber = digits ? formatCardNumber(digits, brand) : text(card.cardNumber);

  return {
    brand: cardBrandNames.includes(text(card.brand)) ? text(card.brand) : "Card",
    cardNumber: formattedCardNumber,
    last4: text(card.last4).replace(/\D/g, "").slice(-4) || digits.slice(-4),
    expiry: text(card.expiry),
    holderName: text(card.holderName).slice(0, MAX_HOLDER_NAME),
  };
};

export const sanitizeCheckoutDetails = (details: CheckoutDetails): { details?: CheckoutDetails; error?: string } => {
  const paymentMethod = PAYMENT_METHODS.includes(details?.paymentMethod) ? details.paymentMethod : null;
  if (!paymentMethod) return { error: "Unsupported payment method." };

  const contact = {
    firstName: sanitizers.name(text(details.contact?.firstName)),
    lastName: sanitizers.name(text(details.contact?.lastName)),
    email: sanitizers.email(text(details.contact?.email)).toLowerCase(),
    phone: sanitizers.phone(text(details.contact?.phone)),
  };
  const shippingAddress = sanitizeAddress(details.shippingAddress);
  const billingAddress = sanitizeAddress(details.billingAddress);
  const card = isCardPayment(paymentMethod) ? sanitizeCard(details.card) : null;

  const hasInvalidDetails =
    Object.keys(validateContact(contact)).length > 0 ||
    !shippingAddress.country ||
    !billingAddress.country ||
    Object.keys(validateAddress(shippingAddress, hasStates(shippingAddress.country))).length > 0 ||
    Object.keys(validateAddress(billingAddress, hasStates(billingAddress.country))).length > 0;

  if (hasInvalidDetails) return { error: "Please check your contact and address details, then try again." };

  const expectedBrand = requiredCardBrand[paymentMethod];
  if (card && expectedBrand && card.brand !== expectedBrand) {
    return { error: `Please use a ${expectedBrand} card, or choose the matching payment option.` };
  }

  if (isCardPayment(paymentMethod) && (!card || card.last4.length !== 4 || validateExpiry(card.expiry))) {
    return { error: "Please check your card details, then try again." };
  }

  return { details: { contact, shippingAddress, billingAddress, paymentMethod, card } };
};
