export type AssistantToolCall = {
  name: string;
  input: Record<string, unknown>;
  ok: boolean;
  summary: string;
};

export type AssistantConversationSummary = {
  id: string;
  userName: string;
  userEmail: string;
  startedAt: string;
  lastMessageAt: string;
  messageCount: number;
  imageCount: number;
  actionCount: number;
  firstQuestion: string;
};

export type AssistantLogMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  images: string[];
  productHandles: string[];
  toolCalls: AssistantToolCall[];
  viewingProduct: string | null;
  status: "complete" | "stopped" | "error";
  error: string | null;
  createdAt: string;
};

export type AssistantConversationDetail = AssistantConversationSummary & {
  messages: AssistantLogMessage[];
};
