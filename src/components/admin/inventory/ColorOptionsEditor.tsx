"use client";

import { Plus, Trash2 } from "lucide-react";
import type { ProductColor } from "@/types/catalog";
import ImageField from "../form/ImageField";
import { TextInput } from "../form/inputs";

interface ColorOptionsEditorProps {
  colors: ProductColor[];
  onChange: (colors: ProductColor[]) => void;
}

const DEFAULT_HEX = "#1d1d1f";

export default function ColorOptionsEditor({ colors, onChange }: ColorOptionsEditorProps) {
  const updateColor = (index: number, patch: Partial<ProductColor>) =>
    onChange(colors.map((color, i) => (i === index ? { ...color, ...patch } : color)));

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-ink">Colors</span>
      <ul className="flex flex-col gap-3">
        {colors.map((color, index) => (
          <li key={index} className="grid gap-3 rounded-[12px] border border-line-light p-3 md:grid-cols-[1fr_auto]">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  type="color"
                  aria-label="Color swatch"
                  value={color.hex.startsWith("#") ? color.hex : DEFAULT_HEX}
                  onChange={(event) => updateColor(index, { hex: event.target.value })}
                  className="h-11 w-11 shrink-0 cursor-pointer rounded-[10px] border border-line bg-surface p-1"
                />
                <TextInput
                  value={color.name}
                  placeholder="Color name, e.g. Midnight"
                  onChange={(event) => updateColor(index, { name: event.target.value })}
                />
                <button
                  type="button"
                  aria-label="Remove color"
                  onClick={() => onChange(colors.filter((_, i) => i !== index))}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-danger-soft hover:text-danger"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <ImageField
                label="Color photo (optional)"
                value={color.image ?? ""}
                onChange={(image) => updateColor(index, { image })}
              />
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onChange([...colors, { name: "", hex: DEFAULT_HEX }])}
        className="flex h-10 items-center justify-center gap-2 rounded-[12px] border border-dashed border-line text-[14px] font-medium text-accent hover:border-accent hover:bg-accent/5"
      >
        <Plus size={16} />
        Add color
      </button>
    </div>
  );
}
