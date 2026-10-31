"use client";

import { useRef } from "react";
import Link from "next/link";
import { Box, Trash2 } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import { AR_MODEL_EXTENSION, AR_MODEL_MAX_MB, AR_MODEL_UPLOAD_ENDPOINT, getArModelPath } from "@/config/arModels";
import useImageUpload from "@/hooks/useImageUpload";

interface ArModelFieldProps {
  value: string;
  handle: string;
  onChange: (url: string) => void;
}

export default function ArModelField({ value, handle, onChange }: ArModelFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading, error } = useImageUpload(AR_MODEL_UPLOAD_ENDPOINT);

  const handleFile = async (file?: File) => {
    if (!file) return;
    const url = await upload(file);
    if (url) onChange(url);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-ink">AR model ({AR_MODEL_EXTENSION})</span>
      <div className="flex flex-wrap items-center gap-4 rounded-[12px] border border-dashed border-line bg-surface-muted p-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-surface text-ink-muted">
          <Box size={22} />
        </span>
        <div className="min-w-0 flex-1 text-[13px]">
          {value ? (
            <Link href={getArModelPath(handle)} target="_blank" className="block truncate text-accent hover:underline">
              {value.split("/").pop()}
            </Link>
          ) : (
            <span className="text-ink-subtle">No AR model yet</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            className="flex h-9 items-center gap-2 rounded-full bg-ink px-4 text-[13px] font-medium text-white transition-colors hover:bg-black disabled:opacity-60"
          >
            {isUploading && <Spinner className="h-3.5 w-3.5" />}
            {value ? "Replace" : "Upload model"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Remove AR model"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-danger hover:text-danger"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={`${AR_MODEL_EXTENSION},model/vnd.usdz+zip`}
          hidden
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>
      <span className={`text-[12px] ${error ? "text-danger" : "text-ink-subtle"}`}>
        {error || `Lets iPhone and iPad shoppers place the product in their room. Max ${AR_MODEL_MAX_MB} MB.`}
      </span>
    </div>
  );
}
