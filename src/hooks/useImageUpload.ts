import { useState } from "react";

export default function useImageUpload(endpoint = "/api/admin/upload") {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setIsUploading(true);
    setError("");

    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch(endpoint, { method: "POST", body });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Upload failed.");
        return null;
      }

      return result.url as string;
    } catch {
      setError("Upload failed. Check your connection and try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, error };
}
