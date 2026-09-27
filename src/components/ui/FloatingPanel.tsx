"use client";

import { forwardRef, useImperativeHandle, useRef, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import useFloatingPosition, { type FloatingAlign } from "@/hooks/useFloatingPosition";

interface FloatingPanelProps {
  anchorRef: RefObject<HTMLElement | null>;
  align?: FloatingAlign;
  maxHeight?: number;
  role?: string;
  ariaLabel?: string;
  className?: string;
  children: ReactNode;
}

const DEFAULT_MAX_HEIGHT = 320;

const FloatingPanel = forwardRef<HTMLDivElement | null, FloatingPanelProps>(
  ({ anchorRef, align = "left", maxHeight = DEFAULT_MAX_HEIGHT, role, ariaLabel, className = "", children }, ref) => {
    const panelRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => panelRef.current as HTMLDivElement);

    const { style, placement } = useFloatingPosition({
      anchorRef,
      panelRef,
      isOpen: true,
      align,
      preferredMaxHeight: maxHeight,
    });
    const offset = placement === "bottom" ? -8 : 8;

    return createPortal(
      <motion.div
        ref={panelRef}
        role={role}
        aria-label={ariaLabel}
        initial={{ opacity: 0, y: offset, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: offset, scale: 0.97 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        style={{ ...style, transformOrigin: placement === "bottom" ? "top" : "bottom" }}
        className={`no-scrollbar w-max overflow-y-auto ${className}`}
      >
        {children}
      </motion.div>,
      document.body
    );
  }
);

FloatingPanel.displayName = "FloatingPanel";

export default FloatingPanel;
