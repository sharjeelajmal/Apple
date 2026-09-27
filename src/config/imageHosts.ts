export const imageHosts = [
  "res.cloudinary.com",
  "is1-ssl.mzstatic.com",
  "www.apple.com",
  "bigon-6.myshopify.com",
  "cdn.shopify.com",
];

export const isAllowedImageUrl = (url: string) => {
  if (url.startsWith("/")) return true;

  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" && imageHosts.includes(hostname);
  } catch {
    return false;
  }
};
