"use client";

import { useRef } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import useImageUpload from "@/hooks/useImageUpload";

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}

export default function ImageField({ label, value, onChange, hint }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading, error } = useImageUpload();

  const handleFile = async (file?: File) => {
    if (!file) return;
    const url = await upload(file);
    if (url) onChange(url);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-ink">{label}</span>
      <div className="flex items-center gap-4 rounded-[12px] border border-dashed border-line bg-surface-muted p-3">
        <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-surface">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus size={22} className="text-ink-subtle" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            className="flex h-9 items-center gap-2 rounded-full bg-ink px-4 text-[13px] font-medium text-white transition-colors hover:bg-black disabled:opacity-60"
          >
            {isUploading && <Spinner className="h-3.5 w-3.5" />}
            {value ? "Replace" : "Upload image"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Remove image"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-danger hover:text-danger"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>
      {(error || hint) && <span className={`text-[12px] ${error ? "text-danger" : "text-ink-subtle"}`}>{error || hint}</span>}
    </div>
  );
}
