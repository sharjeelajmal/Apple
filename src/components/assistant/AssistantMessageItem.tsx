"use client";

import { useState } from "react";
import { Camera, Check, Copy, RotateCcw, Volume2, VolumeX } from "lucide-react";
import type { ChatMessage } from "@/hooks/useAssistantChat";
import AssistantProductCard from "./AssistantProductCard";
import AssistantReply, { stripSuggestions } from "./AssistantReply";

const COPIED_FEEDBACK_MS = 1500;

const formatTime = (isoDate: string) =>
  new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(isoDate));

type AssistantMessageItemProps = {
  message: ChatMessage;
  isLatest: boolean;
  isSpeaking: boolean;
  canSpeak: boolean;
  onToggleSpeak: (message: ChatMessage) => void;
  onNavigate: () => void;
  onSuggestion: (text: string) => void;
  onRetry: () => void;
};

function TypingDots() {
  return (
    <span className="flex gap-1.5 py-2" aria-label="Assistant is typing">
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          className="h-2 w-2 animate-bounce rounded-full bg-ink-subtle"
          style={{ animationDelay: `${dot * 150}ms` }}
        />
      ))}
    </span>
  );
}

export default function AssistantMessageItem({
  message,
  isLatest,
  isSpeaking,
  canSpeak,
  onToggleSpeak,
  onNavigate,
  onSuggestion,
  onRetry,
}: AssistantMessageItemProps) {
  const [isCopied, setIsCopied] = useState(false);
  const imageCount = message.images?.length ?? message.imageCount ?? 0;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(stripSuggestions(message.text));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), COPIED_FEEDBACK_MS);
  };

  if (message.role === "user") {
    return (
      <li className="flex flex-col items-end gap-1.5">
        {message.images?.length ? (
          <div className="flex flex-wrap justify-end gap-1.5">
            {message.images.map((image) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={image.id} src={image.previewUrl} alt="Shared photo" className="h-24 w-24 rounded-[14px] object-cover" />
            ))}
          </div>
        ) : (
          imageCount > 0 && (
            <span className="flex items-center gap-1 text-[12px] text-ink-subtle">
              <Camera size={13} />
              {imageCount} {imageCount === 1 ? "photo" : "photos"} shared
            </span>
          )
        )}
        {message.text && (
          <p
            dir="auto"
            className="max-w-[85%] whitespace-pre-line rounded-[18px] rounded-br-md bg-accent px-4 py-2.5 text-[15px] text-white [overflow-wrap:anywhere]"
          >
            {message.text}
          </p>
        )}
        <time className="text-[11px] text-ink-subtle">{formatTime(message.createdAt)}</time>
      </li>
    );
  }

  const hasText = Boolean(stripSuggestions(message.text));

  return (
    <li dir="auto" className="group flex min-w-0 max-w-[95%] flex-col gap-2 text-[15px] leading-relaxed text-ink [overflow-wrap:anywhere]">
      {message.status && <p className="animate-pulse text-[13px] text-ink-muted">{message.status}…</p>}
      {hasText ? <AssistantReply text={message.text} onNavigate={onNavigate} /> : message.isStreaming && !message.status && <TypingDots />}

      {message.error && (
        <div className="flex flex-wrap items-center gap-3 rounded-field bg-danger-soft px-3 py-2 text-[14px] text-danger">
          {message.error}
          {isLatest && (
            <button type="button" onClick={onRetry} className="flex items-center gap-1 font-medium underline">
              <RotateCcw size={14} />
              Try again
            </button>
          )}
        </div>
      )}

      {message.products && message.products.length > 0 && (
        <div className="flex flex-col gap-2">
          {message.products.map((product) => (
            <AssistantProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      )}

      {!message.isStreaming && hasText && (
        <div className="flex items-center gap-3 text-[11px] text-ink-subtle">
          <time>{formatTime(message.createdAt)}</time>
          <button type="button" onClick={handleCopy} className="flex items-center gap-1 hover:text-ink" aria-label="Copy reply">
            {isCopied ? <Check size={13} /> : <Copy size={13} />}
            {isCopied ? "Copied" : "Copy"}
          </button>
          {canSpeak && (
            <button
              type="button"
              onClick={() => onToggleSpeak(message)}
              className={`flex items-center gap-1 hover:text-ink ${isSpeaking ? "text-accent" : ""}`}
              aria-label={isSpeaking ? "Stop reading" : "Read reply aloud"}
            >
              {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
              {isSpeaking ? "Stop" : "Listen"}
            </button>
          )}
        </div>
      )}

      {isLatest && !message.isStreaming && message.suggestions && message.suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {message.suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onSuggestion(suggestion)}
              className="rounded-full border border-line px-3 py-1.5 text-left text-[13px] text-ink transition-colors hover:border-accent hover:text-accent"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </li>
  );
}
