export type VoicePhase = "idle" | "listening" | "thinking" | "speaking";

export const voicePhaseLabels: Record<VoicePhase, string> = {
  idle: "Tap the waves or the mic to talk",
  listening: "Listening…",
  thinking: "Thinking…",
  speaking: "Speaking · tap to interrupt",
};
