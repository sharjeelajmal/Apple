"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import QRCode from "qrcode";
import useDismiss from "@/hooks/useDismiss";

type ArQrDialogProps = {
  title: string;
  onClose: () => void;
};

export default function ArQrDialog({ title, onClose }: ArQrDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [qrCode, setQrCode] = useState("");

  useDismiss(panelRef, onClose);

  useEffect(() => {
    QRCode.toDataURL(window.location.href, { width: 440, margin: 1 }).then(setQrCode);
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[var(--z-popover)] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ar-dialog-title"
        className="relative w-full max-w-[380px] rounded-card bg-surface p-6 text-center shadow-float md:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-surface-muted"
        >
          <X size={18} />
        </button>
        <h2 id="ar-dialog-title" className="text-[21px] font-semibold text-ink">
          See it in your space
        </h2>
        <p className="mt-2 text-[14px] text-ink-muted">
          Scan with your iPhone or iPad camera, then tap “View in your space” to place {title} right in front of you.
        </p>
        <div className="mx-auto mt-6 flex h-[220px] w-[220px] items-center justify-center rounded-field bg-white">
          {qrCode && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrCode} alt={`QR code to open ${title} on your phone`} className="h-full w-full" />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
