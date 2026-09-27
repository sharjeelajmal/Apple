"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { TextInput } from "./inputs";

interface TagsFieldProps {
  label: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  hint?: string;
}

export default function TagsField({ label, value, onChange, placeholder, hint }: TagsFieldProps) {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const tag = draft.trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setDraft("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag();
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-ink">{label}</span>
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <li key={tag} className="flex items-center gap-1 rounded-full bg-surface-muted py-1 pl-3 pr-1.5 text-[13px] text-ink">
              {tag}
              <button
                type="button"
                aria-label={`Remove ${tag}`}
                onClick={() => onChange(value.filter((item) => item !== tag))}
                className="flex h-5 w-5 items-center justify-center rounded-full text-ink-muted hover:bg-line-light hover:text-ink"
              >
                <X size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <TextInput
        value={draft}
        placeholder={placeholder}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
      />
      {hint && <span className="text-[12px] text-ink-subtle">{hint}</span>}
    </div>
  );
}
