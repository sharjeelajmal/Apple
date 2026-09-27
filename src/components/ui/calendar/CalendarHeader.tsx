import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeaderProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  children: ReactNode;
}

export default function CalendarHeader({
  onPrevious,
  onNext,
  canGoPrevious = true,
  canGoNext = true,
  children,
}: CalendarHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <NavButton label="Previous" disabled={!canGoPrevious} onClick={onPrevious}>
        <ChevronLeft size={18} />
      </NavButton>
      <div className="flex items-center gap-1">{children}</div>
      <NavButton label="Next" disabled={!canGoNext} onClick={onNext}>
        <ChevronRight size={18} />
      </NavButton>
    </div>
  );
}

export function HeaderTitleButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-3 py-1.5 text-[15px] font-semibold text-ink transition-colors hover:bg-surface-muted"
    >
      {children}
    </button>
  );
}

function NavButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-muted disabled:opacity-25"
    >
      {children}
    </button>
  );
}
