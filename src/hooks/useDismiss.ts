import { useEffect, type RefObject } from "react";

type ElementRef = RefObject<HTMLElement | null>;

export default function useDismiss(refs: ElementRef | ElementRef[], onDismiss: () => void) {
  useEffect(() => {
    const elements = Array.isArray(refs) ? refs : [refs];

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!elements.some((ref) => ref.current?.contains(target))) onDismiss();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [refs, onDismiss]);
}
