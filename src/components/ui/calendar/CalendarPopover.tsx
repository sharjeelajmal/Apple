"use client";

import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { CalendarDays } from "lucide-react";
import FloatingPanel from "@/components/ui/FloatingPanel";
import useDismiss from "@/hooks/useDismiss";

const PANEL_MAX_HEIGHT = 420;

interface CalendarPopoverProps {
  label: string;
  displayValue: string;
  placeholder: string;
  buttonClassName: string;
  children: (close: () => void) => ReactNode;
}

export default function CalendarPopover({
  label,
  displayValue,
  placeholder,
  buttonClassName,
  children,
}: CalendarPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dismissRefs = useMemo(() => [containerRef, panelRef], []);
  const close = useCallback(() => setIsOpen(false), []);
  useDismiss(dismissRefs, close);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={buttonClassName}
      >
        <span className={displayValue ? "text-ink" : "text-ink-subtle"}>{displayValue || placeholder}</span>
        <CalendarDays size={18} className="shrink-0 text-ink-subtle" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <FloatingPanel
            ref={panelRef}
            anchorRef={containerRef}
            role="dialog"
            ariaLabel={label}
            maxHeight={PANEL_MAX_HEIGHT}
            className="rounded-[20px] border border-line-light bg-surface/95 p-4 shadow-float backdrop-blur-xl"
          >
            <div className="w-[268px]">{children(close)}</div>
          </FloatingPanel>
        )}
      </AnimatePresence>
    </div>
  );
}
