import type { LucideIcon } from "lucide-react";

type ChatStatTileProps = {
  icon: LucideIcon;
  label: string;
  value: number;
};

export default function ChatStatTile({ icon: Icon, label, value }: ChatStatTileProps) {
  return (
    <div className="flex items-center gap-4 rounded-card border border-line-light bg-surface p-5 shadow-soft">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
        <Icon size={20} />
      </span>
      <span>
        <span className="block text-[26px] font-semibold leading-none tracking-tight text-ink">{value}</span>
        <span className="mt-1 block text-[13px] text-ink-muted">{label}</span>
      </span>
    </div>
  );
}
