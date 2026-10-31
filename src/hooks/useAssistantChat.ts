import { useRef, useState } from "react";
import { ASSISTANT_STORAGE_KEY } from "@/config/assistant";
import type { PendingImage } from "@/lib/assistantImages";
import type { AssistantEvent, ChatTurn } from "@/types/assistant";
import type { ProductCardData } from "@/types/catalog";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  images?: PendingImage[];
  imageCount?: number;
  products?: ProductCardData[];
  suggestions?: string[];
  status?: string;
  isStreaming?: boolean;
  error?: string;
  createdAt: string;
};

const createMessage = (message: Omit<ChatMessage, "id" | "createdAt">): ChatMessage => ({
  ...message,
  id: crypto.randomUUID(),
  createdAt: new Date().toISOString(),
});

type SavedChat = {
  conversationId: string;
  messages: ChatMessage[];
};

const storageKey = (userId: string) => `${ASSISTANT_STORAGE_KEY}:${userId}`;

const newChat = (): SavedChat => ({ conversationId: crypto.randomUUID(), messages: [] });

const readSavedChat = (userId: string): SavedChat => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey(userId)) ?? "null");
    return saved && typeof saved.conversationId === "string" && Array.isArray(saved.messages) ? saved : newChat();
  } catch {
    return newChat();
  }
};

const saveChat = (userId: string, { conversationId, messages }: SavedChat) => {
  try {
    const compact = messages
      .filter((message) => !message.error)
      .map((message) => ({
        id: message.id,
        role: message.role,
        text: message.text,
        imageCount: message.images?.length ?? message.imageCount,
        products: message.products,
        suggestions: message.suggestions,
        createdAt: message.createdAt,
      }));
    sessionStorage.setItem(storageKey(userId), JSON.stringify({ conversationId, messages: compact }));
  } catch {}
};

const toChatTurn = ({ role, text, images }: ChatMessage): ChatTurn => ({
  role,
  text,
  images: images?.map(({ mediaType, data }) => ({ mediaType, data })),
});

async function* readEvents(response: Response): AsyncGenerator<AssistantEvent> {
  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (line.trim()) yield JSON.parse(line);
    }
  }
}

export type VoiceReplyLanguage = "en" | "hi" | "ur";

type SendOptions = {
  voiceLanguage?: VoiceReplyLanguage;
};

type UseAssistantChatOptions = {
  userId: string | null;
  productHandle: string | null;
  onReplyProgress?: (message: ChatMessage) => void;
  onReplyComplete?: (message: ChatMessage) => void;
};

export default function useAssistantChat({ userId, productHandle, onReplyProgress, onReplyComplete }: UseAssistantChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const messagesRef = useRef<ChatMessage[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const loadedForRef = useRef<string | null>(null);
  const conversationIdRef = useRef("");

  const commit = (next: ChatMessage[]) => {
    messagesRef.current = next;
    setMessages(next);
  };

  const persist = () => {
    if (userId) saveChat(userId, { conversationId: conversationIdRef.current, messages: messagesRef.current });
  };

  const loadSavedChat = () => {
    if (!userId || loadedForRef.current === userId) return;
    loadedForRef.current = userId;
    const saved = readSavedChat(userId);
    conversationIdRef.current = saved.conversationId;
    commit(saved.messages);
  };

  const updateReply = (id: string, update: (message: ChatMessage) => Partial<ChatMessage>) =>
    commit(messagesRef.current.map((message) => (message.id === id ? { ...message, ...update(message) } : message)));

  const request = async (history: ChatMessage[], { voiceLanguage }: SendOptions = {}) => {
    conversationIdRef.current ||= crypto.randomUUID();
    const reply = createMessage({ role: "assistant", text: "", isStreaming: true });
    const controller = new AbortController();
    abortRef.current = controller;
    commit([...history, reply]);
    setIsSending(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.filter((message) => !message.error).map(toChatTurn),
          productHandle,
          conversationId: conversationIdRef.current,
          voiceLanguage,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error ?? "Something went wrong. Please try again.");
      }

      for await (const event of readEvents(response)) {
        if (event.type === "text") {
          updateReply(reply.id, (message) => ({ text: message.text + event.delta, status: undefined }));
          const current = messagesRef.current.find((message) => message.id === reply.id);
          if (current) onReplyProgress?.(current);
        }
        if (event.type === "status") updateReply(reply.id, () => ({ status: event.label }));
        if (event.type === "done") updateReply(reply.id, () => ({ products: event.products, suggestions: event.suggestions }));
        if (event.type === "error") throw new Error(event.message);
      }
    } catch (error) {
      if (controller.signal.aborted) {
        updateReply(reply.id, (message) => ({ text: message.text || "Stopped." }));
      } else {
        const message = error instanceof Error ? error.message : "Check your connection and try again.";
        updateReply(reply.id, () => ({ error: message }));
      }
    } finally {
      updateReply(reply.id, () => ({ isStreaming: false, status: undefined }));
      persist();
      abortRef.current = null;
      setIsSending(false);

      const finished = messagesRef.current.find((message) => message.id === reply.id);
      if (finished && !controller.signal.aborted) onReplyComplete?.(finished);
    }
  };

  const send = (text: string, images: PendingImage[] = [], options: SendOptions = {}) => {
    const content = text.trim();
    if ((!content && !images.length) || isSending) return;

    const history = messagesRef.current.filter((message) => !message.error);
    request([...history, createMessage({ role: "user", text: content, images })], options);
  };

  const retry = () => {
    if (isSending) return;
    const history = messagesRef.current.filter((message) => !message.error);
    if (history.at(-1)?.role === "user") request(history);
  };

  const stop = () => abortRef.current?.abort();

  const reset = () => {
    stop();
    conversationIdRef.current = crypto.randomUUID();
    commit([]);
    persist();
  };

  return { messages, isSending, send, retry, stop, reset, loadSavedChat };
}
