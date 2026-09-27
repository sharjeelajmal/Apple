"use client";

import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { moveItem } from "@/lib/arrays";

interface RepeaterProps<Item extends { id: string }> {
  items: Item[];
  onChange: (items: Item[]) => void;
  createItem: () => Item;
  itemLabel: (item: Item, index: number) => string;
  addLabel: string;
  renderItem: (item: Item, update: (patch: Partial<Item>) => void) => ReactNode;
}

export default function Repeater<Item extends { id: string }>({
  items,
  onChange,
  createItem,
  itemLabel,
  addLabel,
  renderItem,
}: RepeaterProps<Item>) {
  const updateItem = (index: number, patch: Partial<Item>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, index) => (
        <article key={item.id} className="rounded-[14px] border border-line-light bg-surface">
          <header className="flex items-center justify-between gap-3 border-b border-line-light px-4 py-3">
            <p className="truncate text-[14px] font-semibold text-ink">
              <span className="mr-2 text-ink-subtle">{index + 1}.</span>
              {itemLabel(item, index)}
            </p>
            <div className="flex shrink-0 gap-1">
              <ToolbarButton label="Move up" disabled={index === 0} onClick={() => onChange(moveItem(items, index, -1))}>
                <ArrowUp size={15} />
              </ToolbarButton>
              <ToolbarButton label="Move down" disabled={index === items.length - 1} onClick={() => onChange(moveItem(items, index, 1))}>
                <ArrowDown size={15} />
              </ToolbarButton>
              <ToolbarButton label="Remove" danger onClick={() => onChange(items.filter((_, i) => i !== index))}>
                <Trash2 size={15} />
              </ToolbarButton>
            </div>
          </header>
          <div className="p-4">{renderItem(item, (patch) => updateItem(index, patch))}</div>
        </article>
      ))}

      <button
        type="button"
        onClick={() => onChange([...items, createItem()])}
        className="flex h-11 items-center justify-center gap-2 rounded-[14px] border border-dashed border-line text-[14px] font-medium text-accent transition-colors hover:border-accent hover:bg-accent/5"
      >
        <Plus size={16} />
        {addLabel}
      </button>
    </div>
  );
}

interface ToolbarButtonProps {
  label: string;
  disabled?: boolean;
  danger?: boolean;
  onClick: () => void;
  children: ReactNode;
}

function ToolbarButton({ label, disabled, danger, onClick, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors disabled:opacity-30 ${
        danger ? "hover:bg-danger-soft hover:text-danger" : "hover:bg-surface-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
