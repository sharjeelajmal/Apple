"use client";

import { Eye, EyeOff, Trash2 } from "lucide-react";
import type { ModerationStatus } from "@/types/review";

type ModerationActionsProps = {
  status: ModerationStatus;
  isPending: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

export default function ModerationActions({ status, isPending, onToggle, onDelete }: ModerationActionsProps) {
  const isHidden = status === "hidden";

  return (
    <>
      <button
        type="button"
        disabled={isPending}
        onClick={onToggle}
        className="flex h-9 items-center gap-2 rounded-full border border-line px-4 text-[13px] text-ink hover:bg-surface-muted"
      >
        {isHidden ? <Eye size={15} /> : <EyeOff size={15} />}
        {isHidden ? "Publish" : "Hide"}
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={onDelete}
        className="flex h-9 items-center gap-2 rounded-full border border-line px-4 text-[13px] text-danger hover:border-danger hover:bg-danger-soft"
      >
        <Trash2 size={15} />
        Delete
      </button>
    </>
  );
}
