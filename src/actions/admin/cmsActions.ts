"use server";

import { revalidatePath } from "next/cache";
import { isAllowedImageUrl } from "@/config/imageHosts";
import { assertAdmin } from "@/lib/adminAuth";
import { cmsCollection, HOME_CONTENT_ID } from "@/lib/cms";
import type { HomeContent, HomeSectionKey } from "@/types/cms";

const HOME_SECTIONS: HomeSectionKey[] = [
  "heroSlides",
  "categoryBanners",
  "carousel",
  "trending",
  "countdown",
  "testimonial",
  "features",
];

const IMAGE_KEYS = new Set(["image", "avatar", "icon"]);

const collectImageUrls = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.flatMap(collectImageUrls);
  if (!value || typeof value !== "object") return [];

  return Object.entries(value).flatMap(([key, item]) =>
    IMAGE_KEYS.has(key) && typeof item === "string" ? [item] : collectImageUrls(item)
  );
};

export async function saveHomeSection<Key extends HomeSectionKey>(section: Key, value: HomeContent[Key]) {
  await assertAdmin();

  if (!HOME_SECTIONS.includes(section)) {
    return { error: "Unknown section." };
  }

  if (!collectImageUrls(value).every((url) => url && isAllowedImageUrl(url))) {
    return { error: "Every image is required. Please upload images instead of linking to other websites." };
  }

  await cmsCollection.updateOne(
    { _id: HOME_CONTENT_ID },
    { $set: { [`content.${section}`]: value, updatedAt: new Date() } },
    { upsert: true }
  );

  revalidatePath("/");
  return { error: "" };
}
