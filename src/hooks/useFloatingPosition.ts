import { useCallback, useLayoutEffect, useState, type CSSProperties, type RefObject } from "react";

const GAP = 8;
const VIEWPORT_MARGIN = 12;
const MIN_HEIGHT = 120;

export type FloatingPlacement = "top" | "bottom";
export type FloatingAlign = "left" | "right";

interface FloatingOptions {
  anchorRef: RefObject<HTMLElement | null>;
  panelRef: RefObject<HTMLElement | null>;
  isOpen: boolean;
  align: FloatingAlign;
  preferredMaxHeight: number;
}

export default function useFloatingPosition({ anchorRef, panelRef, isOpen, align, preferredMaxHeight }: FloatingOptions) {
  const [style, setStyle] = useState<CSSProperties>({
    position: "fixed",
    top: 0,
    left: 0,
    visibility: "hidden",
    zIndex: "var(--z-popover)",
  });
  const [placement, setPlacement] = useState<FloatingPlacement>("bottom");

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return;

    const anchorRect = anchor.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const spaceBelow = viewportHeight - anchorRect.bottom - GAP - VIEWPORT_MARGIN;
    const spaceAbove = anchorRect.top - GAP - VIEWPORT_MARGIN;
    const contentHeight = Math.min(panel.scrollHeight, preferredMaxHeight);
    const nextPlacement: FloatingPlacement = contentHeight > spaceBelow && spaceAbove > spaceBelow ? "top" : "bottom";
    const availableHeight = Math.max(MIN_HEIGHT, nextPlacement === "top" ? spaceAbove : spaceBelow);

    const width = Math.min(Math.max(panel.scrollWidth, anchorRect.width), viewportWidth - VIEWPORT_MARGIN * 2);
    const preferredLeft = align === "right" ? anchorRect.right - width : anchorRect.left;
    const left = Math.min(Math.max(preferredLeft, VIEWPORT_MARGIN), viewportWidth - width - VIEWPORT_MARGIN);

    setPlacement(nextPlacement);
    setStyle({
      position: "fixed",
      left,
      minWidth: anchorRect.width,
      maxWidth: viewportWidth - VIEWPORT_MARGIN * 2,
      maxHeight: Math.min(preferredMaxHeight, availableHeight),
      zIndex: "var(--z-popover)",
      ...(nextPlacement === "bottom"
        ? { top: anchorRect.bottom + GAP }
        : { bottom: viewportHeight - anchorRect.top + GAP }),
    });
  }, [anchorRef, panelRef, align, preferredMaxHeight]);

  useLayoutEffect(() => {
    if (!isOpen) return;

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  return { style, placement };
}
