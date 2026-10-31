import "server-only";
import { v2 as cloudinary, type UploadApiOptions, type UploadApiResponse } from "cloudinary";
import { cloudinaryConfig } from "@/config/env";

const UPLOAD_FOLDER = "apple-store";
const MODEL_FOLDER = `${UPLOAD_FOLDER}/ar-models`;

const configure = () =>
  cloudinary.config({
    cloud_name: cloudinaryConfig.cloudName,
    api_key: cloudinaryConfig.apiKey,
    api_secret: cloudinaryConfig.apiSecret,
    secure: true,
  });

async function uploadFile(file: File, options: UploadApiOptions) {
  configure();

  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (error, response) => {
        if (error || !response) reject(error ?? new Error("Upload failed."));
        else resolve(response);
      })
      .end(buffer);
  });

  return result.secure_url;
}

export const uploadImage = (file: File) => uploadFile(file, { folder: UPLOAD_FOLDER, resource_type: "image" });

export const uploadChatImage = (file: File) =>
  uploadFile(file, { folder: `${UPLOAD_FOLDER}/assistant-chats`, resource_type: "image" });

export const uploadArModel = (file: File) =>
  uploadFile(file, { folder: MODEL_FOLDER, resource_type: "raw", use_filename: true, unique_filename: true });

const getRawPublicId = (url: string) => url.split("/raw/upload/")[1]?.replace(/^v\d+\//, "") ?? null;

export function getArModelDownloadUrl(url: string) {
  const publicId = getRawPublicId(url);
  if (!publicId) return null;

  configure();
  return cloudinary.utils.private_download_url(publicId, "", { resource_type: "raw", type: "upload" });
}
