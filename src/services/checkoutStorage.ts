import type { CheckoutContact, OrderAddress } from "@/types/order";

const SHIPPING_KEY = "apple_checkout_shipping";

export type ShippingDetails = {
  contact: CheckoutContact;
  address: OrderAddress;
};

export const emptyContact: CheckoutContact = { firstName: "", lastName: "", email: "", phone: "" };

export const emptyAddress = (country = "US"): OrderAddress => ({
  street: "",
  apartment: "",
  city: "",
  state: "",
  postalCode: "",
  country,
});

export const saveShippingDetails = (details: ShippingDetails) => {
  sessionStorage.setItem(SHIPPING_KEY, JSON.stringify(details));
};

export const readShippingDetails = (): ShippingDetails | null => {
  try {
    const saved = sessionStorage.getItem(SHIPPING_KEY);
    return saved ? (JSON.parse(saved) as ShippingDetails) : null;
  } catch {
    return null;
  }
};

export const clearShippingDetails = () => sessionStorage.removeItem(SHIPPING_KEY);
