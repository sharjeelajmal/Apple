export const OPEN_ASSISTANT_EVENT = "assistant:open";

export type AssistantProductContext = {
  handle: string;
  title: string;
};

export const openAssistant = (product: AssistantProductContext | null = null) =>
  window.dispatchEvent(new CustomEvent<AssistantProductContext | null>(OPEN_ASSISTANT_EVENT, { detail: product }));
