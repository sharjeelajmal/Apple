import { Sparkles } from "lucide-react";

export default function AiBadge({ label = "AI powered" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent/10 to-violet-500/10 px-3 py-1 text-[12px] font-semibold text-accent">
      <Sparkles size={13} />
      {label}
    </span>
  );
}
