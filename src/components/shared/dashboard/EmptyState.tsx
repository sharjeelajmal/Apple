import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-card border border-dashed border-line bg-surface px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted text-ink-muted">
        <Icon size={24} />
      </span>
      <h3 className="mt-5 text-[19px] font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-[360px] text-[15px] text-ink-muted">{description}</p>
      {actionLabel && actionHref && (
        <Button href={actionHref} size="sm" className="mt-6 font-medium">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
