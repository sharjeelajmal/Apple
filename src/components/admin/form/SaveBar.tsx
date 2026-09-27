import type { ReactNode } from "react";
import FormAlert from "@/components/ui/FormAlert";
import Spinner from "@/components/ui/Spinner";

export type SaveStatus = { tone: "success" | "error"; message: string };

interface SaveBarProps {
  status: SaveStatus;
  isSaving: boolean;
  label?: string;
  onSave?: () => void;
  children?: ReactNode;
}

export default function SaveBar({ status, isSaving, label = "Save Changes", onSave, children }: SaveBarProps) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-2 flex flex-col gap-3 border-t border-line-light bg-surface/90 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <FormAlert message={status.message} tone={status.tone} />
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {children}
        <button
          type={onSave ? "button" : "submit"}
          onClick={onSave}
          disabled={isSaving}
          className="flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 text-[15px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {isSaving && <Spinner className="h-4 w-4" />}
          {isSaving ? "Saving..." : label}
        </button>
      </div>
    </div>
  );
}
