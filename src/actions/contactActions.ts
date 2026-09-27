"use server";

import { messagesCollection } from "@/lib/messages";
import { validateEmail, validateRequired } from "@/lib/validators";

export type ContactInput = {
  name: string;
  email: string;
  orderNumber: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const MAX_MESSAGE_LENGTH = 2000;

const validateContact = (input: ContactInput): ContactErrors => {
  const errors: ContactErrors = {
    name: validateRequired(input.name, "name"),
    email: validateEmail(input.email),
    message:
      validateRequired(input.message, "message") ||
      (input.message.length > MAX_MESSAGE_LENGTH ? `Keep your message under ${MAX_MESSAGE_LENGTH} characters.` : ""),
  };

  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message));
};

export async function sendContactMessage(input: ContactInput) {
  const errors = validateContact(input);
  if (Object.keys(errors).length) {
    return { success: false, errors };
  }

  await messagesCollection.insertOne({
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    orderNumber: input.orderNumber.trim() || null,
    message: input.message.trim(),
    status: "new",
    createdAt: new Date(),
  });

  return { success: true, errors: {} };
}
