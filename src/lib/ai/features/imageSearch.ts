import "server-only";
import type { AssistantImage } from "@/types/assistant";
import { getStorefrontProducts } from "@/lib/catalog";
import { catalogDigest, pickKnownHandles } from "../catalogContext";
import { generateJson, objectSchema } from "../generateJson";

type ImageMatch = { handle: string; reason: string };

export async function searchByImage(image: AssistantImage) {
  const catalog = await getStorefrontProducts();

  const result = await generateJson<{ description: string; matches: ImageMatch[] }>({
    system: `You identify devices in shoppers' photos for an Apple store's visual search.
- description: one short sentence naming what's in the photo (device type, model if you can tell, color).
- matches: up to 6 catalog products that best match the photo, closest first, using their exact handle. If the photo shows a non-Apple device, return the closest Apple equivalents. If it shows no device at all, return an empty list.
- reason: a few words on why it matches (e.g. "Same foldable design").
The catalog may include models newer than you know, so match on the descriptions given.`,
    schema: objectSchema({
      description: { type: "string" },
      matches: { type: "array", items: objectSchema({ handle: { type: "string" }, reason: { type: "string" } }) },
    }),
    maxTokens: 3000,
    content: [
      { type: "image", source: { type: "base64", media_type: image.mediaType, data: image.data } },
      {
        type: "text",
        text: `Find this in our catalog:\n${catalogDigest(catalog)}\n\nProduct details:\n${catalog
          .map((product) => `${product.handle}: ${product.description.slice(0, 160)}`)
          .join("\n")}`,
      },
    ],
  });

  return {
    description: result.description,
    matches: pickKnownHandles(result.matches, catalog).map(({ product, reason }) => ({ product, reason })),
  };
}
