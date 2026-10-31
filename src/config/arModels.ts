export const AR_MODEL_EXTENSION = ".usdz";
export const AR_MODEL_MAX_MB = 10;
export const AR_MODEL_UPLOAD_ENDPOINT = "/api/admin/upload/ar-model";

export const getArModelPath = (handle: string) => `/ar/${handle}${AR_MODEL_EXTENSION}`;

export const isArModelUrl = (url: string) => {
  try {
    const { protocol, hostname, pathname } = new URL(url);
    return protocol === "https:" && hostname === "res.cloudinary.com" && pathname.toLowerCase().endsWith(AR_MODEL_EXTENSION);
  } catch {
    return false;
  }
};
