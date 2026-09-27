import type { ReactNode } from "react";
import SaveBar, { type SaveStatus } from "../form/SaveBar";

interface SectionEditorFrameProps {
  title: string;
  description: string;
  status: SaveStatus;
  isSaving: boolean;
  onSave: () => void;
  children: ReactNode;
}

export default function SectionEditorFrame({ title, description, status, isSaving, onSave, children }: SectionEditorFrameProps) {
  return (
    <section className="rounded-card border border-line-light bg-surface px-4 pt-6 shadow-soft sm:px-6">
      <header className="mb-6">
        <h2 className="text-[21px] font-semibold tracking-tight text-ink">{title}</h2>
        <p className="mt-1 text-[14px] text-ink-muted">{description}</p>
      </header>
      <div className="pb-6">{children}</div>
      <SaveBar status={status} isSaving={isSaving} onSave={onSave} />
    </section>
  );
}
