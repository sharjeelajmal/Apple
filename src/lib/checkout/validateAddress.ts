import type { CheckoutContact, OrderAddress } from "@/types/order";
import { addressValidators } from "./addressValidation";

type Errors<T> = Partial<Record<keyof T, string>>;

const withoutEmpty = <T,>(errors: Errors<T>) =>
  Object.fromEntries(Object.entries(errors).filter(([, message]) => message)) as Errors<T>;

export const validateContact = (contact: CheckoutContact) =>
  withoutEmpty<CheckoutContact>({
    firstName: addressValidators.name(contact.firstName, "first name"),
    lastName: addressValidators.name(contact.lastName, "last name"),
    email: addressValidators.email(contact.email),
    phone: addressValidators.phone(contact.phone),
  });

export const validateAddress = (address: OrderAddress, hasStates: boolean) =>
  withoutEmpty<OrderAddress>({
    street: addressValidators.street(address.street),
    city: addressValidators.city(address.city),
    state: addressValidators.state(address.state, hasStates),
    postalCode: addressValidators.postalCode(address.postalCode, address.country),
  });
