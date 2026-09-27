"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, ImagePlus, X } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import useImageUpload from "@/hooks/useImageUpload";
import { moveItem } from "@/lib/arrays";

interface ImageListFieldProps {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageListField({ label, value, onChange }: ImageListFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading, error } = useImageUpload();

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const url = await upload(file);
      if (url) uploaded.push(url);
    }
    onChange([...value, ...uploaded]);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-ink">{label}</span>
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        {value.map((url, index) => (
          <li key={url} className="group relative aspect-square overflow-hidden rounded-[12px] border border-line-light bg-surface-muted">
            <img src={url} alt="" className="h-full w-full object-contain p-2" />
            {index === 0 && (
              <span className="absolute left-2 top-2 rounded-full bg-ink px-2 py-0.5 text-[11px] font-medium text-white">Main</span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-linear-to-t from-black/50 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100 max-md:opacity-100">
              <div className="flex gap-1">
                <IconButton label="Move left" disabled={index === 0} onClick={() => onChange(moveItem(value, index, -1))}>
                  <ChevronLeft size={14} />
                </IconButton>
                <IconButton label="Move right" disabled={index === value.length - 1} onClick={() => onChange(moveItem(value, index, 1))}>
                  <ChevronRight size={14} />
                </IconButton>
              </div>
              <IconButton label="Remove image" onClick={() => onChange(value.filter((_, i) => i !== index))}>
                <X size={14} />
              </IconButton>
            </div>
          </li>
        ))}
        <li>
          <button
            type="button"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-[12px] border border-dashed border-line text-[13px] text-ink-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-60"
          >
            {isUploading ? <Spinner className="h-5 w-5" /> : <ImagePlus size={22} />}
            {isUploading ? "Uploading..." : "Add images"}
          </button>
        </li>
      </ul>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />
      <span className={`text-[12px] ${error ? "text-danger" : "text-ink-subtle"}`}>
        {error || "The first image is the main product photo. Use the arrows to reorder."}
      </span>
    </div>
  );
}

interface IconButtonProps {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function IconButton({ label, disabled, onClick, children }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink transition-colors hover:bg-white disabled:opacity-40"
    >
      {children}
    </button>
  );
}
