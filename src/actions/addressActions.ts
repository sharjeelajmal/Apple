"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import type { AddressInput } from "@/types/address";
import { requireSession } from "@/lib/session";
import { addressesCollection } from "@/lib/addresses";

const REQUIRED_FIELDS: (keyof AddressInput)[] = ["fullName", "street", "city", "postalCode", "country"];

const sanitize = (input: AddressInput): AddressInput => ({
  label: input.label.trim() || "Home",
  fullName: input.fullName.trim(),
  phone: input.phone.trim(),
  street: input.street.trim(),
  city: input.city.trim(),
  state: input.state.trim(),
  postalCode: input.postalCode.trim(),
  country: input.country.trim(),
});

const toObjectId = (id: string) => {
  if (!ObjectId.isValid(id)) throw new Error("Address not found.");
  return new ObjectId(id);
};

const refreshAddresses = () => revalidatePath("/account", "layout");

export async function saveAddress(input: AddressInput, addressId?: string) {
  const { user } = await requireSession();
  const address = sanitize(input);

  const missing = REQUIRED_FIELDS.filter((field) => !address[field]);
  if (missing.length) {
    return { error: "Please fill in all required fields." };
  }

  if (addressId) {
    await addressesCollection.updateOne(
      { _id: toObjectId(addressId), userId: user.id },
      { $set: address }
    );
  } else {
    const hasAddresses = (await addressesCollection.countDocuments({ userId: user.id })) > 0;
    await addressesCollection.insertOne({
      ...address,
      userId: user.id,
      isDefault: !hasAddresses,
      createdAt: new Date(),
    });
  }

  refreshAddresses();
  return { error: "" };
}

export async function deleteAddress(addressId: string) {
  const { user } = await requireSession();
  const deleted = await addressesCollection.findOneAndDelete({
    _id: toObjectId(addressId),
    userId: user.id,
  });

  if (deleted?.isDefault) {
    await addressesCollection.updateOne(
      { userId: user.id },
      { $set: { isDefault: true } },
      { sort: { createdAt: -1 } }
    );
  }

  refreshAddresses();
}

export async function setDefaultAddress(addressId: string) {
  const { user } = await requireSession();

  await addressesCollection.updateMany({ userId: user.id }, { $set: { isDefault: false } });
  await addressesCollection.updateOne(
    { _id: toObjectId(addressId), userId: user.id },
    { $set: { isDefault: true } }
  );

  refreshAddresses();
}
