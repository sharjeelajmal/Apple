"use client";

import { useState, type ReactNode } from "react";

type FormRevealProps = {
  label: string;
  children: ReactNode;
};

export default function FormReveal({ label, children }: FormRevealProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) return <div className="mb-6">{children}</div>;

  return (
    <button
      type="button"
      onClick={() => setIsOpen(true)}
      className="mb-6 rounded-full bg-ink px-6 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-black"
    >
      {label}
    </button>
  );
}
