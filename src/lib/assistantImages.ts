import { ASSISTANT_IMAGE_MAX_DIMENSION, assistantImageTypes } from "@/config/assistant";
import type { AssistantImage } from "@/types/assistant";

export type PendingImage = AssistantImage & {
  id: string;
  previewUrl: string;
};

const JPEG_QUALITY = 0.85;

const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unsupported image"));
    };
    image.src = url;
  });

export const isSupportedImage = (file: File) => assistantImageTypes.some((type) => type === file.type);

export async function prepareImage(file: File): Promise<PendingImage> {
  const image = await loadImage(file);
  const scale = Math.min(1, ASSISTANT_IMAGE_MAX_DIMENSION / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not supported");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const previewUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  return {
    id: crypto.randomUUID(),
    mediaType: "image/jpeg",
    data: previewUrl.split(",")[1],
    previewUrl,
  };
}
