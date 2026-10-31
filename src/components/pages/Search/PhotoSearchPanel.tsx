"use client";

import { Camera } from "lucide-react";
import { useRef } from "react";
import PhotoSearchResults from "@/components/layout/search/PhotoSearchResults";
import usePhotoSearch from "@/hooks/usePhotoSearch";

export default function PhotoSearchPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const photo = usePhotoSearch();

  return (
    <div className="mx-auto mt-6 w-full max-w-[640px]">
      {photo.state.status === "idle" ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mx-auto flex items-center gap-2 rounded-full border border-dashed border-line px-5 py-2.5 text-[14px] text-ink-muted transition-colors hover:border-accent hover:text-accent"
        >
          <Camera size={17} />
          Or search with a photo
        </button>
      ) : (
        <div className="rounded-card bg-surface-muted py-4">
          <PhotoSearchResults
            preview={"preview" in photo.state ? photo.state.preview : undefined}
            isLoading={photo.state.status === "loading"}
            description={photo.state.status === "done" ? photo.state.description : undefined}
            matches={photo.state.status === "done" ? photo.state.matches : undefined}
            error={photo.state.status === "error" ? photo.state.message : undefined}
            onClear={photo.clear}
            onNavigate={() => undefined}
          />
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) photo.search(file);
        }}
      />
    </div>
  );
}
