import { NextResponse, type NextRequest } from "next/server";
import {
  ASSISTANT_IMAGE_MAX_BYTES,
  ASSISTANT_IMAGE_TURNS_KEPT,
  ASSISTANT_MAX_HISTORY,
  ASSISTANT_MAX_IMAGES_PER_MESSAGE,
  ASSISTANT_MAX_MESSAGE_LENGTH,
  ASSISTANT_RATE_LIMIT,
  assistantImageTypes,
} from "@/config/assistant";
import { assistantConfig } from "@/config/env";
import { toAiErrorMessage } from "@/lib/ai/client";
import { runAssistant } from "@/lib/assistant/runAssistant";
import { logAssistantTurn, uploadChatImages } from "@/lib/assistantLog";
import { getProductByHandle } from "@/lib/catalog";
import { createRateLimiter } from "@/lib/rateLimit";
import { getSession } from "@/lib/session";
import type { AssistantEvent, AssistantImage, ChatTurn } from "@/types/assistant";
import type { AssistantToolCall } from "@/types/assistantLog";

const isAllowed = createRateLimiter(ASSISTANT_RATE_LIMIT);
const MAX_BASE64_LENGTH = Math.ceil((ASSISTANT_IMAGE_MAX_BYTES * 4) / 3);

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

const isImage = (value: unknown): value is AssistantImage => {
  const image = value as AssistantImage;
  return (
    Boolean(image) &&
    assistantImageTypes.includes(image.mediaType) &&
    typeof image.data === "string" &&
    image.data.length > 0 &&
    image.data.length <= MAX_BASE64_LENGTH
  );
};

const isChatTurn = (value: unknown): value is ChatTurn => {
  const turn = value as ChatTurn;
  if (!turn || (turn.role !== "user" && turn.role !== "assistant") || typeof turn.text !== "string") return false;

  const images = turn.images ?? [];
  const hasValidImages =
    Array.isArray(images) &&
    images.length <= ASSISTANT_MAX_IMAGES_PER_MESSAGE &&
    images.every(isImage) &&
    (turn.role === "user" || images.length === 0);

  return hasValidImages && (turn.text.trim().length > 0 || images.length > 0);
};

const readHistory = (body: unknown): ChatTurn[] | null => {
  const messages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(messages) || !messages.every(isChatTurn)) return null;

  const history = messages.slice(-ASSISTANT_MAX_HISTORY);
  while (history[0]?.role === "assistant") history.shift();

  const latest = history.at(-1);
  if (latest?.role !== "user" || latest.text.length > ASSISTANT_MAX_MESSAGE_LENGTH) return null;

  const imageTurns = history.filter((turn) => turn.images?.length).slice(-ASSISTANT_IMAGE_TURNS_KEPT);
  return history.map((turn) => ({
    role: turn.role,
    text: turn.text.slice(0, ASSISTANT_MAX_MESSAGE_LENGTH * 4) || (turn.images?.length ? "[Shared a photo]" : ""),
    images: imageTurns.includes(turn) ? turn.images : undefined,
  }));
};

const encodeEvent = (event: AssistantEvent) => new TextEncoder().encode(`${JSON.stringify(event)}\n`);

const readViewingProduct = async (body: unknown) => {
  const handle = (body as { productHandle?: unknown })?.productHandle;
  if (typeof handle !== "string" || !handle) return null;

  const product = await getProductByHandle(handle.slice(0, 120));
  return product ? { handle: product.handle, title: product.title } : null;
};

const VOICE_LANGUAGES = ["en", "hi", "ur"] as const;

const readVoiceLanguage = (body: unknown) => {
  const language = (body as { voiceLanguage?: unknown })?.voiceLanguage;
  return VOICE_LANGUAGES.find((value) => value === language) ?? null;
};

const readConversationId = (body: unknown) => {
  const id = (body as { conversationId?: unknown })?.conversationId;
  return typeof id === "string" && /^[\w-]{8,64}$/.test(id) ? id : crypto.randomUUID();
};

const linkedHandles = (text: string) => [...new Set([...text.matchAll(/\]\(\/products\/([a-z0-9-]+)\)/g)].map((match) => match[1]))];

export async function POST(request: NextRequest) {
  if (!assistantConfig.isEnabled) return fail("The shopping assistant isn't available right now.", 503);

  const session = await getSession();
  if (!session) return fail("Please sign in to chat with our assistant.", 401);
  if (!isAllowed(session.user.id)) return fail("You're sending messages too quickly. Please wait a few minutes.", 429);

  const body = await request.json().catch(() => null);
  const history = readHistory(body);
  if (!history) {
    return fail(`Please send a message under ${ASSISTANT_MAX_MESSAGE_LENGTH} characters with up to ${ASSISTANT_MAX_IMAGES_PER_MESSAGE} photos.`, 400);
  }

  const viewingProduct = await readViewingProduct(body);
  const context = { userId: session.user.id, viewingProduct, voiceLanguage: readVoiceLanguage(body) };
  const question = history[history.length - 1];
  const turn = {
    clientId: readConversationId(body),
    user: { id: session.user.id, name: session.user.name, email: session.user.email },
    viewingProduct: viewingProduct?.title ?? null,
    question: { text: question.text, askedAt: new Date() },
    imageUploads: uploadChatImages(question.images),
  };
  const toolCalls: AssistantToolCall[] = [];
  let isCancelled = false;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let reply = "";
      let error: string | null = null;

      try {
        for await (const event of runAssistant(history, context, toolCalls)) {
          if (isCancelled) break;
          if (event.type === "text") reply += event.delta;
          if (event.type === "error") error = event.message;
          controller.enqueue(encodeEvent(event));
        }
      } catch (caught) {
        console.error("Assistant request failed", caught);
        error = toAiErrorMessage(caught);
        if (!isCancelled) controller.enqueue(encodeEvent({ type: "error", message: error }));
      }

      if (!isCancelled) controller.close();
      await logAssistantTurn({
        ...turn,
        reply,
        productHandles: linkedHandles(reply),
        toolCalls,
        status: error ? "error" : isCancelled ? "stopped" : "complete",
        error,
      }).catch((logError) => console.error("Couldn't save assistant chat", logError));
    },
    cancel() {
      isCancelled = true;
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });
}
