"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AudioLines, Bot, ImagePlus, Maximize2, Minimize2, RotateCcw, Tag, Volume2, VolumeX, X } from "lucide-react";
import { ASSISTANT_MAX_IMAGES_PER_MESSAGE, assistantStarters, productStarters } from "@/config/assistant";
import { authClient } from "@/lib/authClient";
import { OPEN_ASSISTANT_EVENT, type AssistantProductContext } from "@/lib/assistantEvents";
import useAssistantChat, { type ChatMessage, type VoiceReplyLanguage } from "@/hooks/useAssistantChat";
import { isSupportedImage, prepareImage, type PendingImage } from "@/lib/assistantImages";
import useSpeechSynthesis, { findVoice } from "@/hooks/useSpeechSynthesis";
import useVoiceConversation from "@/hooks/useVoiceConversation";
import useVoiceLanguage from "@/hooks/useVoiceLanguage";
import AssistantComposer from "./AssistantComposer";
import AssistantMessageItem from "./AssistantMessageItem";
import AssistantSignInPrompt from "./AssistantSignInPrompt";
import VoiceModeView, { type VoicePhase } from "./VoiceModeView";

const toVoiceReplyLanguage = (language: string): VoiceReplyLanguage => {
  if (language.startsWith("ur")) return findVoice(language) ? "ur" : "hi";
  return language.startsWith("hi") ? "hi" : "en";
};

const iconButtonClassName =
  "flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink";

export default function ShoppingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [images, setImages] = useState<PendingImage[]>([]);
  const [isPreparingImages, setIsPreparingImages] = useState(false);
  const [imageError, setImageError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [productContext, setProductContext] = useState<AssistantProductContext | null>(null);
  const [readAloud, setReadAloud] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const voiceModeRef = useRef(false);
  const [voiceLanguage, setVoiceLanguage] = useVoiceLanguage();
  const speech = useSpeechSynthesis();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const userId = session?.user.id ?? null;
  const conversation = useVoiceConversation({
    lang: voiceLanguage,
    onUtterance: (text) => {
      speech.stop();
      send(text, [], { voiceLanguage: toVoiceReplyLanguage(voiceLanguage) });
    },
  });
  const { messages, isSending, send, retry, stop, reset, loadSavedChat } = useAssistantChat({
    userId,
    productHandle: productContext?.handle ?? null,
    onReplyProgress: (message) => {
      if (voiceModeRef.current) speech.feed(message.id, message.text, false);
    },
    onReplyComplete: (message) => {
      if (voiceModeRef.current) {
        speech.feed(message.id, message.error ?? message.text, true, () => {
          if (voiceModeRef.current) conversation.start();
        });
      } else if (readAloud && !message.error) {
        speech.speak(message.id, message.text);
      }
    },
  });

  useEffect(() => {
    voiceModeRef.current = voiceMode;
  }, [voiceMode]);

  const isAudioOn = readAloud || speech.speakingId !== null;

  const toggleAudio = () => {
    if (isAudioOn) {
      speech.stop();
      setReadAloud(false);
    } else {
      setReadAloud(true);
    }
  };

  const toggleSpeak = (message: ChatMessage) =>
    speech.speakingId === message.id ? speech.stop() : speech.speak(message.id, message.text);

  const startVoiceMode = () => {
    speech.prime();
    speech.stop();
    setVoiceMode(true);
    conversation.start();
  };

  const endVoiceMode = () => {
    conversation.stop();
    speech.stop();
    setVoiceMode(false);
  };

  const lastQuestion = messages.findLast((message) => message.role === "user");
  const lastAnswer = messages.at(-1)?.role === "assistant" ? messages.at(-1) : undefined;
  const isAnswerSpeaking = Boolean(lastAnswer && speech.speakingId === lastAnswer.id && lastAnswer.text);
  const voicePhase: VoicePhase = conversation.isListening
    ? "listening"
    : isAnswerSpeaking
      ? "speaking"
      : isSending
        ? "thinking"
        : "idle";

  const handleWavePress = () => {
    if (voicePhase === "listening") conversation.finish();
    else if (voicePhase === "speaking") {
      speech.stop();
      conversation.start();
    } else if (voicePhase === "idle") conversation.start();
  };
  const starters = productContext ? productStarters : assistantStarters;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && userId) loadSavedChat();
  }, [isOpen, userId, loadSavedChat]);

  const open = () => {
    setHasUnread(false);
    setIsOpen(true);
  };

  const close = () => {
    endVoiceMode();
    setIsOpen(false);
  };

  useEffect(() => {
    const handleOpen = (event: Event) => {
      setProductContext((event as CustomEvent<AssistantProductContext | null>).detail);
      open();
    };
    window.addEventListener(OPEN_ASSISTANT_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, handleOpen);
  });

  const sendMessage = (text: string) => {
    send(text, images);
    setImages([]);
    setImageError("");
  };

  const sendAndNotify = (text: string) => {
    sendMessage(text);
    if (!isOpen) setHasUnread(true);
  };

  const addFiles = async (files: File[]) => {
    const supported = files.filter(isSupportedImage);
    const room = ASSISTANT_MAX_IMAGES_PER_MESSAGE - images.length;
    setImageError(
      supported.length < files.length
        ? "Only JPG, PNG, WebP or GIF photos can be shared."
        : supported.length > room
          ? `You can send up to ${ASSISTANT_MAX_IMAGES_PER_MESSAGE} photos at a time.`
          : ""
    );
    if (room <= 0 || !supported.length) return;

    setIsPreparingImages(true);
    try {
      const prepared = await Promise.all(supported.slice(0, room).map(prepareImage));
      setImages((current) => [...current, ...prepared].slice(0, ASSISTANT_MAX_IMAGES_PER_MESSAGE));
    } catch {
      setImageError("That photo couldn't be read. Try a different one.");
    } finally {
      setIsPreparingImages(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={open}
            className="fixed bottom-5 right-5 z-[90] flex items-center gap-2 rounded-full bg-ink px-5 py-3.5 text-[15px] font-medium text-white shadow-float transition-colors hover:bg-black"
          >
            <Bot size={24} />
            Ask our assistant
            {(hasUnread || isSending) && <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-label="New reply" />}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            aria-label="Shopping assistant"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) setIsDragging(false);
            }}
            onDrop={handleDrop}
            className={`fixed inset-0 z-[110] flex flex-col bg-surface sm:inset-auto sm:bottom-5 sm:right-5 sm:max-h-[calc(100vh-40px)] sm:rounded-card sm:shadow-float ${
              isExpanded ? "sm:h-[calc(100vh-40px)] sm:w-[640px]" : "sm:h-[640px] sm:w-[400px]"
            }`}
          >
            <header className="flex items-center justify-between border-b border-line-light px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-violet-500 text-white">
                  <Bot size={26} />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-surface bg-positive" />
                </span>
                <div>
                  <h2 className="text-[15px] font-semibold text-ink">Shopping assistant</h2>
                  <p className="text-[12px] text-ink-muted">
                    {voiceMode ? "Voice conversation" : isSending ? "Typing…" : "Online · answers from our live catalog"}
                  </p>
                </div>
              </div>
              <div className="flex">
                {userId && speech.isSupported && !voiceMode && (
                  <button
                    type="button"
                    onClick={toggleAudio}
                    aria-pressed={isAudioOn}
                    aria-label={isAudioOn ? "Turn sound off" : "Read replies aloud"}
                    title={isAudioOn ? "Turn sound off" : "Read replies aloud"}
                    className={`${iconButtonClassName} ${isAudioOn ? "bg-accent/10 text-accent" : ""}`}
                  >
                    {isAudioOn ? <Volume2 size={17} /> : <VolumeX size={17} />}
                  </button>
                )}
                {userId && speech.isSupported && (
                  <button
                    type="button"
                    onClick={voiceMode ? endVoiceMode : startVoiceMode}
                    aria-pressed={voiceMode}
                    aria-label={voiceMode ? "Turn off voice mode" : "Turn on voice mode"}
                    title="Voice mode: speak, hear the answer, keep talking"
                    className={`${iconButtonClassName} ${voiceMode ? "bg-accent text-white hover:bg-accent-hover hover:text-white" : ""}`}
                  >
                    <AudioLines size={17} />
                  </button>
                )}
                {messages.length > 0 && !voiceMode && (
                  <button type="button" onClick={reset} aria-label="Start a new chat" className={iconButtonClassName}>
                    <RotateCcw size={17} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsExpanded((current) => !current)}
                  aria-label={isExpanded ? "Make smaller" : "Make larger"}
                  className={`${iconButtonClassName} hidden sm:flex`}
                >
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button type="button" onClick={close} aria-label="Close assistant" className={iconButtonClassName}>
                  <X size={19} />
                </button>
              </div>
            </header>

            {!userId ? (
              isSessionPending ? (
                <div className="flex flex-1 items-center justify-center text-[14px] text-ink-muted">Loading…</div>
              ) : (
                <AssistantSignInPrompt onNavigate={close} />
              )
            ) : (
              <>
              <div ref={scrollRef} className="relative flex-1 overflow-y-auto overflow-x-hidden px-4 py-5">
                {messages.length === 0 ? (
                  <div>
                    <p className="text-[15px] leading-relaxed text-ink">
                      {productContext
                        ? `Ask me anything about the ${productContext.title}: performance, battery, camera, which storage to pick or how it compares.`
                        : "Hi! I can help you choose a product, compare models, check, cancel or return your orders, and answer questions about shipping. You can also send a photo of a device and I'll find it for you."}
                    </p>
                    <div className="mt-5 flex flex-col gap-2">
                      {starters.map((starter) => (
                        <button
                          key={starter}
                          type="button"
                          onClick={() => sendAndNotify(starter)}
                          className="rounded-field border border-line px-4 py-2.5 text-left text-[14px] text-ink transition-colors hover:border-accent hover:text-accent"
                        >
                          {starter}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-5">
                    {messages.map((message, index) => (
                      <AssistantMessageItem
                        key={message.id}
                        message={message}
                        isLatest={index === messages.length - 1}
                        onNavigate={close}
                        onSuggestion={sendAndNotify}
                        onRetry={retry}
                        canSpeak={speech.isSupported}
                        isSpeaking={speech.speakingId === message.id}
                        onToggleSpeak={toggleSpeak}
                      />
                    ))}
                  </ul>
                )}
              </div>

              {productContext && (
                <div className="flex items-center gap-2 px-4 pt-2 text-[12px] text-ink-muted">
                  <Tag size={13} />
                  Asking about
                  <span className="font-medium text-ink">{productContext.title}</span>
                  <button
                    type="button"
                    onClick={() => setProductContext(null)}
                    aria-label="Stop asking about this product"
                    className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-surface-muted"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              {imageError && <p className="px-4 pb-1 text-[13px] text-danger">{imageError}</p>}
              <AssistantComposer
                images={images}
                isSending={isSending}
                isPreparingImages={isPreparingImages}
                onAddFiles={addFiles}
                onRemoveImage={(id) => setImages((current) => current.filter((image) => image.id !== id))}
                onSend={sendAndNotify}
                onStop={stop}
              />
              <p className="pb-2 text-center text-[11px] text-ink-subtle">AI answers can make mistakes. Check details on the product page.</p>

              </>
            )}

            <AnimatePresence>
              {userId && voiceMode && (
                <VoiceModeView
                  phase={voicePhase}
                  level={conversation.level}
                  liveTranscript={conversation.transcript}
                  question={lastQuestion?.text ?? ""}
                  answer={lastAnswer?.error ?? lastAnswer?.text ?? ""}
                  products={lastAnswer?.products ?? []}
                  error={conversation.error}
                  language={voiceLanguage}
                  onLanguageChange={(language) => {
                    conversation.stop();
                    setVoiceLanguage(language);
                  }}
                  onWavePress={handleWavePress}
                  onMicToggle={() => (conversation.isListening ? conversation.stop() : conversation.start())}
                  onExit={endVoiceMode}
                  onClose={close}
                  onNavigate={close}
                />
              )}
            </AnimatePresence>

            {isDragging && (
              <div className="pointer-events-none absolute inset-2 flex flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-accent bg-surface/90 text-[15px] font-medium text-accent">
                <ImagePlus size={28} />
                Drop a photo to share it
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
