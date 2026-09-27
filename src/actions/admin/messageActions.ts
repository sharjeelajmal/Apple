"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/adminAuth";
import { messagesCollection, type MessageStatus } from "@/lib/messages";

const toObjectId = (id: string) => {
  if (!ObjectId.isValid(id)) throw new Error("Message not found.");
  return new ObjectId(id);
};

export async function setMessageStatus(messageId: string, status: MessageStatus) {
  await assertAdmin();
  await messagesCollection.updateOne({ _id: toObjectId(messageId) }, { $set: { status } });
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(messageId: string) {
  await assertAdmin();
  await messagesCollection.deleteOne({ _id: toObjectId(messageId) });
  revalidatePath("/admin", "layout");
}
