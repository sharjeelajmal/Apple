"use client";

import { motion } from "framer-motion";
import { Mic, MicOff, X } from "lucide-react";
import CustomDropdown from "@/components/shared/CustomDropdown";
import { voiceLanguages } from "@/config/assistant";
import type { ProductCardData } from "@/types/catalog";
import AssistantProductCard from "./AssistantProductCard";
import AssistantReply from "./AssistantReply";
import IntelligenceGlow from "./voice/IntelligenceGlow";
import IntelligenceWave from "./voice/IntelligenceWave";
import { voicePhaseLabels, type VoicePhase } from "./voice/voicePhase";

export type { VoicePhase } from "./voice/voicePhase";

type VoiceModeViewProps = {
  phase: VoicePhase;
  level: number;
  liveTranscript: string;
  question: string;
  answer: string;
  products: ProductCardData[];
  error: string;
  language: string;
  onLanguageChange: (language: string) => void;
  onWavePress: () => void;
  onMicToggle: () => void;
  onExit: () => void;
  onClose: () => void;
  onNavigate: () => void;
};

const controlClassName = "flex h-14 w-14 items-center justify-center rounded-full transition-colors";

export default function VoiceModeView({
  phase,
  level,
  liveTranscript,
  question,
  answer,
  products,
  error,
  language,
  onLanguageChange,
  onWavePress,
  onMicToggle,
  onExit,
  onClose,
  onNavigate,
}: VoiceModeViewProps) {
  const isListening = phase === "listening";
  const shownQuestion = isListening ? liveTranscript : question;
  const showAnswer = !isListening && Boolean(answer);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex flex-col overflow-hidden rounded-[inherit] bg-gradient-to-b from-surface via-surface to-surface-muted text-ink"
    >
      <IntelligenceGlow phase={phase} />

      <div className="relative flex items-center justify-between px-5 pt-4">
        <span className="text-[13px] font-semibold tracking-wide text-ink-muted">Voice</span>
        <div className="flex items-center gap-2">
          <CustomDropdown
            options={voiceLanguages}
            value={language}
            onChange={onLanguageChange}
            ariaLabel="Voice language"
            buttonClassName="flex h-8 items-center gap-1 rounded-full bg-surface-muted px-3 text-[12px] text-ink hover:bg-line-light"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close assistant"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-muted text-ink hover:bg-line-light"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="relative flex-1 space-y-4 overflow-y-auto px-6 pt-6">
        {shownQuestion ? (
          <p dir="auto" className="text-[15px] leading-relaxed text-ink-muted [overflow-wrap:anywhere]">
            {shownQuestion}
          </p>
        ) : (
          !showAnswer && <p className="text-[22px] font-semibold leading-snug tracking-tight">How can I help you shop today?</p>
        )}
        {showAnswer && (
          <motion.div
            key={answer.slice(0, 12)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            dir="auto"
            className="text-[20px] font-semibold leading-snug tracking-tight [overflow-wrap:anywhere]"
          >
            <AssistantReply text={answer} onNavigate={onNavigate} />
          </motion.div>
        )}
        {showAnswer && products.length > 0 && (
          <div className="flex flex-col gap-2 pb-2">
            {products.map((product) => (
              <AssistantProductCard key={product.id} product={product} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={onWavePress}
          aria-label={phase === "speaking" ? "Interrupt and talk" : isListening ? "I'm done talking" : "Talk to the assistant"}
          className="block h-36 w-full"
        >
          <IntelligenceWave phase={phase} level={level} />
        </button>
        <p className="text-center text-[13px] text-ink-muted" aria-live="polite">
          {error || voicePhaseLabels[phase]}
        </p>
      </div>

      <div className="relative flex items-center justify-center gap-8 py-6">
        <button
          type="button"
          onClick={onMicToggle}
          aria-label={isListening ? "Pause listening" : "Start talking"}
          className={`${controlClassName} ${isListening ? "bg-ink text-white" : "bg-surface-muted text-ink hover:bg-line-light"}`}
        >
          {isListening ? <Mic size={22} /> : <MicOff size={22} />}
        </button>
        <button type="button" onClick={onExit} aria-label="End voice mode" className={`${controlClassName} bg-danger text-white hover:opacity-90`}>
          <X size={24} />
        </button>
      </div>
    </motion.div>
  );
}
