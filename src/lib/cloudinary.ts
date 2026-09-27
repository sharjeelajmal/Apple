import "server-only";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { cloudinaryConfig } from "@/config/env";

const UPLOAD_FOLDER = "apple-store";

export async function uploadImage(file: File) {
  cloudinary.config({
    cloud_name: cloudinaryConfig.cloudName,
    api_key: cloudinaryConfig.apiKey,
    api_secret: cloudinaryConfig.apiSecret,
    secure: true,
  });

  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: UPLOAD_FOLDER, resource_type: "image" }, (error, response) => {
        if (error || !response) reject(error ?? new Error("Upload failed."));
        else resolve(response);
      })
      .end(buffer);
  });

  return result.secure_url;
}
