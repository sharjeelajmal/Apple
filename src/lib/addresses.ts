import "server-only";
import type { ObjectId } from "mongodb";
import type { Address, AddressInput } from "@/types/address";
import { db } from "./mongodb";

export type AddressDocument = AddressInput & {
  _id?: ObjectId;
  userId: string;
  isDefault: boolean;
  createdAt: Date;
};

export const addressesCollection = db.collection<AddressDocument>("addresses");

const toAddress = (document: AddressDocument): Address => ({
  id: String(document._id),
  label: document.label,
  fullName: document.fullName,
  phone: document.phone,
  street: document.street,
  city: document.city,
  state: document.state,
  postalCode: document.postalCode,
  country: document.country,
  isDefault: document.isDefault,
});

export const getAddressesForUser = async (userId: string) => {
  const documents = await addressesCollection
    .find({ userId })
    .sort({ isDefault: -1, createdAt: -1 })
    .toArray();
  return documents.map(toAddress);
};
