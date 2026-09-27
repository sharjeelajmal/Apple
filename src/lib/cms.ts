import "server-only";
import { connection } from "next/server";
import { defaultHomeContent } from "@/data/seed/defaultHomeContent";
import type { HomeContent } from "@/types/cms";
import { db } from "./mongodb";

export const HOME_CONTENT_ID = "home";

type CmsDocument = {
  _id: string;
  content: Partial<HomeContent>;
  updatedAt: Date;
};

export const cmsCollection = db.collection<CmsDocument>("cms");

export async function getHomeContent(): Promise<HomeContent> {
  await connection();
  const document = await cmsCollection.findOne({ _id: HOME_CONTENT_ID });
  return { ...defaultHomeContent, ...document?.content };
}
