"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Search, X } from "lucide-react";
import { moveItem } from "@/lib/arrays";
import { TextInput } from "../form/inputs";

export type ProductOption = {
  handle: string;
  title: string;
  image: string;
  categoryName: string;
};

interface ProductPickerProps {
  label: string;
  options: ProductOption[];
  value: string[];
  onChange: (handles: string[]) => void;
}

const MAX_SUGGESTIONS = 8;

export default function ProductPicker({ label, options, value, onChange }: ProductPickerProps) {
  const [query, setQuery] = useState("");
  const byHandle = new Map(options.map((option) => [option.handle, option]));
  const suggestions = options
    .filter((option) => !value.includes(option.handle))
    .filter((option) => option.title.toLowerCase().includes(query.trim().toLowerCase()))
    .slice(0, MAX_SUGGESTIONS);

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[13px] font-medium text-ink">{label}</span>

      {value.length ? (
        <ol className="flex flex-col gap-2">
          {value.map((handle, index) => {
            const product = byHandle.get(handle);
            return (
              <li key={handle} className="flex items-center gap-3 rounded-[12px] border border-line-light bg-surface p-2 pr-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-surface-muted">
                  {product?.image && <img src={product.image} alt="" className="h-full w-full object-contain p-1" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium text-ink">{product?.title ?? handle}</span>
                  <span className={`block text-[12px] ${product ? "text-ink-subtle" : "text-danger"}`}>
                    {product?.categoryName ?? "Not found in inventory"}
                  </span>
                </span>
                <div className="flex gap-1">
                  <button type="button" aria-label="Move up" disabled={index === 0} onClick={() => onChange(moveItem(value, index, -1))} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-surface-muted disabled:opacity-30">
                    <ArrowUp size={15} />
                  </button>
                  <button type="button" aria-label="Move down" disabled={index === value.length - 1} onClick={() => onChange(moveItem(value, index, 1))} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-surface-muted disabled:opacity-30">
                    <ArrowDown size={15} />
                  </button>
                  <button type="button" aria-label="Remove" onClick={() => onChange(value.filter((item) => item !== handle))} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-danger-soft hover:text-danger">
                    <X size={15} />
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="rounded-[12px] bg-surface-muted px-4 py-3 text-[14px] text-ink-muted">No products selected yet.</p>
      )}

      <div className="rounded-[12px] border border-line-light p-3">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle" />
          <TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search inventory to add..." className="pl-10" />
        </div>
        <ul className="mt-2 flex flex-col">
          {suggestions.map((option) => (
            <li key={option.handle}>
              <button
                type="button"
                onClick={() => onChange([...value, option.handle])}
                className="flex w-full items-center gap-3 rounded-[10px] px-2 py-2 text-left hover:bg-surface-muted"
              >
                <Plus size={15} className="text-accent" />
                <span className="flex-1 truncate text-[14px] text-ink">{option.title}</span>
                <span className="text-[12px] text-ink-subtle">{option.categoryName}</span>
              </button>
            </li>
          ))}
          {!suggestions.length && <li className="px-2 py-2 text-[13px] text-ink-subtle">No more products to add.</li>}
        </ul>
      </div>
    </div>
  );
}
