import { useState } from "react";
import { searchProductsByPhoto, type AiPick } from "@/actions/aiActions";
import { isSupportedImage, prepareImage } from "@/lib/assistantImages";

type PhotoSearchState =
  | { status: "idle" }
  | { status: "loading"; preview: string }
  | { status: "done"; preview: string; description: string; matches: AiPick[] }
  | { status: "error"; preview?: string; message: string };

export default function usePhotoSearch() {
  const [state, setState] = useState<PhotoSearchState>({ status: "idle" });

  const search = async (file: File) => {
    if (!isSupportedImage(file)) {
      setState({ status: "error", message: "Please choose a JPG, PNG, WebP or GIF photo." });
      return;
    }

    try {
      const image = await prepareImage(file);
      setState({ status: "loading", preview: image.previewUrl });
      const result = await searchProductsByPhoto({ mediaType: image.mediaType, data: image.data });
      setState(
        result.data
          ? { status: "done", preview: image.previewUrl, ...result.data }
          : { status: "error", preview: image.previewUrl, message: result.error }
      );
    } catch {
      setState({ status: "error", message: "That photo couldn't be read. Try a different one." });
    }
  };

  const clear = () => setState({ status: "idle" });

  return { state, search, clear };
}
