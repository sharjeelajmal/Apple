import type { ReactNode } from "react";

interface CalendarCellProps {
  isSelected: boolean;
  isDisabled?: boolean;
  isHighlighted?: boolean;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}

export default function CalendarCell({
  isSelected,
  isDisabled = false,
  isHighlighted = false,
  onClick,
  className = "h-11",
  children,
}: CalendarCellProps) {
  const stateClass = isSelected
    ? "bg-accent font-semibold text-white"
    : isHighlighted
      ? "font-semibold text-accent hover:bg-accent/10"
      : "text-ink hover:bg-surface-muted";

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-pressed={isSelected}
      onClick={onClick}
      className={`flex w-full items-center justify-center rounded-full text-[14px] transition-colors duration-150 disabled:cursor-not-allowed disabled:text-ink-subtle/50 disabled:hover:bg-transparent ${stateClass} ${className}`}
    >
      {children}
    </button>
  );
}
