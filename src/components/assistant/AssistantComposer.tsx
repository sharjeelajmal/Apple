"use client";

import { useLayoutEffect, useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from "react";
import { ArrowUp, ImagePlus, Mic, Square, X } from "lucide-react";
import CustomDropdown from "@/components/shared/CustomDropdown";
import { ASSISTANT_MAX_IMAGES_PER_MESSAGE, ASSISTANT_MAX_MESSAGE_LENGTH, voiceLanguages } from "@/config/assistant";
import useVoiceLanguage from "@/hooks/useVoiceLanguage";
import useVoiceSearch from "@/hooks/useVoiceSearch";
import type { PendingImage } from "@/lib/assistantImages";

const MAX_TEXTAREA_HEIGHT = 120;

type AssistantComposerProps = {
  images: PendingImage[];
  isSending: boolean;
  isPreparingImages: boolean;
  onAddFiles: (files: File[]) => void;
  onRemoveImage: (id: string) => void;
  onSend: (text: string) => void;
  onStop: () => void;
};

export default function AssistantComposer({
  images,
  isSending,
  isPreparingImages,
  onAddFiles,
  onRemoveImage,
  onSend,
  onStop,
}: AssistantComposerProps) {
  const [draft, setDraft] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textBeforeVoiceRef = useRef("");
  const [voiceLanguage, setVoiceLanguage] = useVoiceLanguage();
  const voice = useVoiceSearch(
    (transcript) => setDraft([textBeforeVoiceRef.current, transcript].filter(Boolean).join(" ").slice(0, ASSISTANT_MAX_MESSAGE_LENGTH)),
    voiceLanguage
  );

  const canSend = (draft.trim().length > 0 || images.length > 0) && !isSending && !isPreparingImages;

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
    textarea.scrollTop = textarea.scrollHeight;
  }, [draft]);

  const startVoice = () => {
    textBeforeVoiceRef.current = draft.trim();
    voice.start();
  };

  const submit = () => {
    if (!canSend) return;
    voice.stop();
    onSend(draft);
    setDraft("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const files = Array.from(event.clipboardData.files);
    if (files.length) {
      event.preventDefault();
      onAddFiles(files);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-line-light p-3">
      {images.length > 0 && (
        <div className="mb-2 flex gap-2">
          {images.map((image) => (
            <div key={image.id} className="relative h-16 w-16 overflow-hidden rounded-[12px] bg-surface-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.previewUrl} alt="Photo to send" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onRemoveImage(image.id)}
                aria-label="Remove photo"
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {voice.isSupported && (
        <div className="mb-2 flex items-center justify-end gap-2 text-[12px] text-ink-muted">
          Voice language
          <CustomDropdown
            options={voiceLanguages}
            value={voiceLanguage}
            onChange={(language) => {
              voice.stop();
              setVoiceLanguage(language);
            }}
            ariaLabel="Voice input language"
            buttonClassName="flex h-7 items-center gap-1 rounded-full border border-line px-3 text-[12px] text-ink hover:border-ink"
          />
        </div>
      )}

      <div className="flex items-end gap-1.5 rounded-[22px] border border-line bg-surface px-2 py-1.5 focus-within:border-accent">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={images.length >= ASSISTANT_MAX_IMAGES_PER_MESSAGE}
          aria-label="Attach a photo"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-surface-muted hover:text-ink disabled:opacity-40"
        >
          <ImagePlus size={19} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          hidden
          onChange={(event) => {
            onAddFiles(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />

        <textarea
          ref={textareaRef}
          value={draft}
          rows={1}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          maxLength={ASSISTANT_MAX_MESSAGE_LENGTH}
          placeholder={voice.isListening ? "Listening..." : "Ask anything or share a photo..."}
          aria-label="Message the shopping assistant"
          dir="auto"
          className="max-h-[120px] min-h-9 min-w-0 flex-1 resize-none overflow-x-hidden bg-transparent py-1.5 text-[15px] leading-6 text-ink outline-none [overflow-wrap:anywhere]"
        />

        {voice.isSupported && (
          <button
            type="button"
            onClick={voice.isListening ? voice.stop : startVoice}
            aria-label={voice.isListening ? "Stop voice input" : "Speak your message"}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
              voice.isListening ? "animate-pulse bg-danger text-white" : "text-ink-muted hover:bg-surface-muted hover:text-ink"
            }`}
          >
            <Mic size={18} />
          </button>
        )}

        {isSending ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generating"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white hover:bg-black"
          >
            <Square size={13} fill="currentColor" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canSend}
            aria-label="Send"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-hover disabled:opacity-40"
          >
            <ArrowUp size={19} />
          </button>
        )}
      </div>
    </form>
  );
}
