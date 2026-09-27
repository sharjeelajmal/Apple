import "server-only";
import type { ObjectId } from "mongodb";
import { db } from "./mongodb";

export type MessageStatus = "new" | "read";

export type ContactMessageDocument = {
  _id?: ObjectId;
  name: string;
  email: string;
  orderNumber: string | null;
  message: string;
  status: MessageStatus;
  createdAt: Date;
};

export type ContactMessage = Omit<ContactMessageDocument, "_id" | "createdAt"> & {
  id: string;
  createdAt: string;
};

export const messagesCollection = db.collection<ContactMessageDocument>("contact_messages");

export async function getContactMessages() {
  const documents = await messagesCollection.find().sort({ createdAt: -1 }).toArray();
  return documents.map(({ _id, createdAt, ...message }): ContactMessage => ({
    ...message,
    id: String(_id),
    createdAt: createdAt.toISOString(),
  }));
}
