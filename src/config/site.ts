export const siteUrls = {
  production: "https://appleofficial.com",
  vercel: "https://apple-official-new.vercel.app",
  local: "http://localhost:3000",
};

export const allowedHosts = [
  ...Object.values(siteUrls).map((url) => new URL(url).host),
  "www.appleofficial.com",
  "apple-official-new-*.vercel.app",
];

export const siteConfig = {
  name: "Aplee",
  tagline: "Your destination for everything Apple.",
  url: process.env.NEXT_PUBLIC_SITE_URL || siteUrls.production,
  contact: {
    email: "contact@aplee.com",
    supportEmail: "support@aplee.com",
    careersEmail: "careers@aplee.com",
    phone: "+1-613-555-0182",
    address: "Shop 009A, Level 4, Block A, Demo Park, Ottawa",
    hours: "Mon – Sat, 9:00 AM – 8:00 PM EST",
  },
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
  },
  legalUpdatedAt: "2026-09-01",
};
