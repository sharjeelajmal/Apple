import { Bot, TriangleAlert } from "lucide-react";
import Link from "next/link";
import AssistantReply from "@/components/assistant/AssistantReply";
import { formatDate } from "@/lib/format";
import type { AssistantLogMessage } from "@/types/assistantLog";
import ToolCallList from "./ToolCallList";

const formatTime = (value: string) => formatDate(value, { year: "numeric", hour: "numeric", minute: "2-digit", second: "2-digit" });

const statusNotes = {
  stopped: "Customer stopped this reply before it finished.",
  error: "The AI couldn't answer this message.",
};

export default function ChatTranscript({ messages }: { messages: AssistantLogMessage[] }) {
  return (
    <ol className="flex flex-col gap-6">
      {messages.map((message) =>
        message.role === "user" ? (
          <li key={message.id} className="flex flex-col items-end gap-1.5">
            <span className="text-[12px] text-ink-subtle">
              Customer · {formatTime(message.createdAt)}
              {message.viewingProduct && ` · on ${message.viewingProduct} page`}
            </span>
            {message.images.length > 0 && (
              <div className="flex flex-wrap justify-end gap-2">
                {message.images.map((image) => (
                  <a key={image} href={image} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt="Photo shared by the customer" className="h-28 w-28 rounded-[14px] object-cover shadow-subtle" />
                  </a>
                ))}
              </div>
            )}
            {message.text && (
              <p dir="auto" className="max-w-[75%] whitespace-pre-line rounded-[18px] rounded-br-md bg-accent px-4 py-2.5 text-[15px] text-white [overflow-wrap:anywhere]">
                {message.text}
              </p>
            )}
          </li>
        ) : (
          <li key={message.id} className="flex max-w-[85%] flex-col gap-2">
            <span className="flex items-center gap-1.5 text-[12px] text-ink-subtle">
              <Bot size={15} className="text-accent" />
              AI assistant · {formatTime(message.createdAt)}
            </span>
            {message.toolCalls.length > 0 && <ToolCallList toolCalls={message.toolCalls} />}
            <div dir="auto" className="rounded-[18px] rounded-bl-md border border-line-light bg-surface px-4 py-3 text-[15px] leading-relaxed text-ink [overflow-wrap:anywhere]">
              {message.text ? <AssistantReply text={message.text} /> : <span className="text-ink-subtle">No reply text.</span>}
            </div>
            {message.productHandles.length > 0 && (
              <p className="flex flex-wrap gap-2 text-[13px]">
                Recommended:
                {message.productHandles.map((handle) => (
                  <Link key={handle} href={`/products/${handle}`} target="_blank" className="text-accent hover:underline">
                    {handle}
                  </Link>
                ))}
              </p>
            )}
            {message.status !== "complete" && (
              <p className="flex items-center gap-1.5 text-[13px] text-danger">
                <TriangleAlert size={14} />
                {message.error ?? statusNotes[message.status]}
              </p>
            )}
          </li>
        )
      )}
    </ol>
  );
}
