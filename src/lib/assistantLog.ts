import "server-only";
import type { ObjectId, WithId } from "mongodb";
import type { AssistantImage } from "@/types/assistant";
import type {
  AssistantConversationSummary,
  AssistantLogMessage,
  AssistantToolCall,
} from "@/types/assistantLog";
import { uploadChatImage } from "./cloudinary";
import { db } from "./mongodb";
import { toObjectId } from "./objectId";

type ConversationDocument = {
  clientId: string;
  userId: string;
  userName: string;
  userEmail: string;
  startedAt: Date;
  lastMessageAt: Date;
  messageCount: number;
  imageCount: number;
  actionCount: number;
  firstQuestion: string;
};

type MessageDocument = {
  conversationId: ObjectId;
  role: "user" | "assistant";
  text: string;
  images: string[];
  productHandles: string[];
  toolCalls: AssistantToolCall[];
  viewingProduct: string | null;
  status: "complete" | "stopped" | "error";
  error: string | null;
  createdAt: Date;
};

const conversationsCollection = db.collection<ConversationDocument>("assistant_conversations");
const messagesCollection = db.collection<MessageDocument>("assistant_messages");

const ACTION_TOOLS = new Set(["cancel_order", "request_return"]);
const LIST_LIMIT = 200;

export type AssistantTurn = {
  clientId: string;
  user: { id: string; name: string; email: string };
  viewingProduct: string | null;
  question: { text: string; askedAt: Date };
  imageUploads: Promise<string[]>;
  reply: string;
  productHandles: string[];
  toolCalls: AssistantToolCall[];
  status: MessageDocument["status"];
  error: string | null;
};

export const uploadChatImages = (images: AssistantImage[] = []) =>
  Promise.all(
    images.map((image) =>
      uploadChatImage(new File([Buffer.from(image.data, "base64")], "chat-photo.jpg", { type: image.mediaType }))
    )
  ).catch(() => []);

export async function logAssistantTurn(turn: AssistantTurn) {
  const images = await turn.imageUploads;
  const now = new Date();
  const actionCount = turn.toolCalls.filter((call) => ACTION_TOOLS.has(call.name) && call.ok).length;

  const conversation = await conversationsCollection.findOneAndUpdate(
    { clientId: turn.clientId, userId: turn.user.id },
    {
      $set: { userName: turn.user.name, userEmail: turn.user.email, lastMessageAt: now },
      $inc: { messageCount: 2, imageCount: images.length, actionCount },
      $setOnInsert: { startedAt: turn.question.askedAt, firstQuestion: turn.question.text.slice(0, 200) || "[Photo]" },
    },
    { upsert: true, returnDocument: "after", projection: { _id: 1 } }
  );
  if (!conversation) return;

  await messagesCollection.insertMany([
    {
      conversationId: conversation._id,
      role: "user",
      text: turn.question.text,
      images,
      productHandles: [],
      toolCalls: [],
      viewingProduct: turn.viewingProduct,
      status: "complete",
      error: null,
      createdAt: turn.question.askedAt,
    },
    {
      conversationId: conversation._id,
      role: "assistant",
      text: turn.reply,
      images: [],
      productHandles: turn.productHandles,
      toolCalls: turn.toolCalls,
      viewingProduct: turn.viewingProduct,
      status: turn.status,
      error: turn.error,
      createdAt: now,
    },
  ]);
}

const toSummary = (document: WithId<ConversationDocument>): AssistantConversationSummary => ({
  id: String(document._id),
  userName: document.userName,
  userEmail: document.userEmail,
  startedAt: document.startedAt.toISOString(),
  lastMessageAt: document.lastMessageAt.toISOString(),
  messageCount: document.messageCount,
  imageCount: document.imageCount,
  actionCount: document.actionCount,
  firstQuestion: document.firstQuestion,
});

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function getAssistantConversations(search = "") {
  const pattern = search.trim() ? new RegExp(escapeRegex(search.trim()), "i") : null;
  const filter = pattern ? { $or: [{ userEmail: pattern }, { userName: pattern }, { firstQuestion: pattern }] } : {};
  const documents = await conversationsCollection.find(filter).sort({ lastMessageAt: -1 }).limit(LIST_LIMIT).toArray();
  return documents.map(toSummary);
}

export async function getAssistantStats() {
  const [conversations, totals] = await Promise.all([
    conversationsCollection.countDocuments(),
    conversationsCollection
      .aggregate<{ messages: number; actions: number; users: string[] }>([
        { $group: { _id: null, messages: { $sum: "$messageCount" }, actions: { $sum: "$actionCount" }, users: { $addToSet: "$userId" } } },
      ])
      .toArray(),
  ]);
  return {
    conversations,
    messages: totals[0]?.messages ?? 0,
    actions: totals[0]?.actions ?? 0,
    customers: totals[0]?.users.length ?? 0,
  };
}

export async function getAssistantConversation(id: string) {
  const objectId = toObjectId(id);
  if (!objectId) return null;

  const conversation = await conversationsCollection.findOne({ _id: objectId });
  if (!conversation) return null;

  const messages = await messagesCollection.find({ conversationId: objectId }).sort({ createdAt: 1, role: -1 }).toArray();
  return {
    ...toSummary(conversation),
    messages: messages.map(
      (message): AssistantLogMessage => ({
        id: String(message._id),
        role: message.role,
        text: message.text,
        images: message.images,
        productHandles: message.productHandles,
        toolCalls: message.toolCalls,
        viewingProduct: message.viewingProduct,
        status: message.status,
        error: message.error,
        createdAt: message.createdAt.toISOString(),
      })
    ),
  };
}
