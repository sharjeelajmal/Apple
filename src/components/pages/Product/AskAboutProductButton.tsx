"use client";

import { Bot } from "lucide-react";
import { openAssistant, type AssistantProductContext } from "@/lib/assistantEvents";

export default function AskAboutProductButton({ product }: { product: AssistantProductContext }) {
  return (
    <button
      type="button"
      onClick={() => openAssistant(product)}
      className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-black"
    >
      <Bot size={16} />
      Ask AI about this product
    </button>
  );
}
