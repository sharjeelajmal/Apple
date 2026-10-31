import type { VoicePhase } from "./voicePhase";

export default function IntelligenceGlow({ phase }: { phase: VoicePhase }) {
  return <div aria-hidden data-phase={phase} className="intelligence-glow pointer-events-none absolute inset-0 rounded-[inherit]" />;
}
