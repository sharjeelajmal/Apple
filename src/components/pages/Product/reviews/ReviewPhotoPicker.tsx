"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { REVIEW_PHOTO_LIMIT, REVIEW_PHOTO_MAX_MB } from "@/config/reviews";

type SelectedPhoto = {
  file: File;
  preview: string;
};

export default function ReviewPhotoPicker({ name }: { name: string }) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [error, setError] = useState("");

  useEffect(() => () => photos.forEach((photo) => URL.revokeObjectURL(photo.preview)), [photos]);

  const syncInput = (files: File[]) => {
    if (!inputRef.current) return;
    const transfer = new DataTransfer();
    files.forEach((file) => transfer.items.add(file));
    inputRef.current.files = transfer.files;
  };

  const updatePhotos = (files: File[]) => {
    syncInput(files);
    setPhotos(files.map((file) => ({ file, preview: URL.createObjectURL(file) })));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const added = Array.from(event.target.files ?? []);
    const valid = added.filter((file) => file.type.startsWith("image/") && file.size <= REVIEW_PHOTO_MAX_MB * 1024 * 1024);
    const files = [...photos.map((photo) => photo.file), ...valid].slice(0, REVIEW_PHOTO_LIMIT);

    setError(
      valid.length < added.length
        ? `Only images under ${REVIEW_PHOTO_MAX_MB} MB can be added.`
        : photos.length + valid.length > REVIEW_PHOTO_LIMIT
          ? `You can add up to ${REVIEW_PHOTO_LIMIT} photos.`
          : ""
    );
    updatePhotos(files);
  };

  const removePhoto = (index: number) => {
    updatePhotos(photos.filter((_, photoIndex) => photoIndex !== index).map((photo) => photo.file));
    setError("");
  };

  return (
    <div>
      <p className="mb-3 text-[14px] font-medium text-ink">
        Add photos <span className="font-normal text-ink-subtle">(optional, up to {REVIEW_PHOTO_LIMIT})</span>
      </p>
      <div className="flex flex-wrap gap-3">
        {photos.map((photo, index) => (
          <div key={photo.preview} className="relative h-20 w-20 overflow-hidden rounded-field bg-surface-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.preview} alt={`Selected photo ${index + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removePhoto(index)}
              aria-label={`Remove photo ${index + 1}`}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {photos.length < REVIEW_PHOTO_LIMIT && (
          <label
            htmlFor={inputId}
            className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-field border border-dashed border-line text-[12px] text-ink-muted transition-colors hover:border-accent hover:text-accent"
          >
            <ImagePlus size={20} />
            Add
          </label>
        )}
      </div>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        name={name}
        accept="image/*"
        multiple
        onChange={handleChange}
        className="sr-only"
      />
      {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
    </div>
  );
}
