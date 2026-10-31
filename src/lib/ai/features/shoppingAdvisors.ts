import "server-only";
import { getStartingPrice } from "@/lib/catalog";
import type { CatalogProduct } from "@/types/catalog";
import { cacheKey, cachedAi } from "../cache";
import { catalogDigest, getInStockCatalog, pickKnownHandles } from "../catalogContext";
import { generateJson, objectSchema, type JsonSchema } from "../generateJson";

export type ProductPick = { handle: string; reason: string };

const pickSchema: JsonSchema = { type: "array", items: objectSchema({ handle: { type: "string" }, reason: { type: "string" } }) };

const RULES = `Only recommend products from the catalog list, using their exact handle. Prices are in US dollars. Write warm, short, plain-English reasons (one sentence each) that speak to this shopper.`;

const resolvePicks = (picks: ProductPick[], catalog: CatalogProduct[]) =>
  pickKnownHandles(picks, catalog).map(({ product, reason }) => ({ product, reason }));

export type GiftRequest = {
  recipient: string;
  occasion: string;
  budget: number;
  interests: string[];
  note: string;
};

export async function findGifts(request: GiftRequest) {
  const catalog = (await getInStockCatalog()).filter((product) => getStartingPrice(product) <= request.budget);
  if (!catalog.length) return { intro: `We don't have anything in stock under $${request.budget} right now.`, picks: [] };

  const result = await cachedAi(cacheKey("gifts", request), 24, () =>
    generateJson<{ intro: string; picks: ProductPick[] }>({
      system: `You are a gift advisor for an Apple store. ${RULES}\n- intro: one friendly sentence.\n- picks: the 3 best gifts, best first, all within budget.`,
      schema: objectSchema({ intro: { type: "string" }, picks: pickSchema }),
      content: `Gift for: ${request.recipient}\nOccasion: ${request.occasion}\nBudget: up to $${request.budget}\nThey like: ${request.interests.join(", ") || "not specified"}\nNotes: ${request.note || "none"}\n\nCatalog:\n${catalogDigest(catalog)}`,
    })
  );
  return { intro: result.intro, picks: resolvePicks(result.picks, catalog) };
}

export type UpgradeRequest = {
  currentDevice: string;
  priorities: string[];
  budget: number | null;
};

export type UpgradeAdvice = {
  verdict: "upgrade" | "wait";
  summary: string;
  improvements: { area: string; current: string; upgrade: string }[];
  picks: ProductPick[];
};

export async function adviseUpgrade(request: UpgradeRequest) {
  const catalog = await getInStockCatalog();

  const advice = await cachedAi(cacheKey("upgrade", request), 24, () =>
    generateJson<UpgradeAdvice>({
      system: `You are an upgrade advisor for an Apple store. Use your knowledge of the shopper's current device and the catalog specs. ${RULES}
- verdict: "upgrade" if a product in the catalog is a clear step up for their priorities and budget, otherwise "wait".
- summary: two sentences explaining the verdict honestly.
- improvements: 3 to 5 areas (camera, battery, performance, display, design...) comparing their device ("current") with the top pick ("upgrade"), in a few words each.
- picks: up to 3 upgrade options from the same product family, best first, respecting the budget when one is given.`,
      schema: objectSchema({
        verdict: { type: "string", enum: ["upgrade", "wait"] },
        summary: { type: "string" },
        improvements: {
          type: "array",
          items: objectSchema({ area: { type: "string" }, current: { type: "string" }, upgrade: { type: "string" } }),
        },
        picks: pickSchema,
      }),
      content: `Current device: ${request.currentDevice}\nWhat matters most: ${request.priorities.join(", ") || "overall"}\nBudget: ${request.budget ? `up to $${request.budget}` : "flexible"}\n\nCatalog:\n${catalogDigest(catalog)}`,
    })
  );
  return { ...advice, picks: resolvePicks(advice.picks, catalog) };
}

export type ShopperSignals = {
  purchased: string[];
  wishlist: string[];
  recentlyViewed: string[];
};

export async function recommendForShopper(signals: ShopperSignals, cacheScope: string) {
  const seen = new Set([...signals.purchased, ...signals.wishlist, ...signals.recentlyViewed]);
  const catalog = await getInStockCatalog();
  const candidates = catalog.filter((product) => !signals.purchased.includes(product.title));
  if (!seen.size) return null;

  const result = await cachedAi(cacheKey("for-you", cacheScope, signals), 12, () =>
    generateJson<{ headline: string; picks: ProductPick[] }>({
      system: `You personalize product recommendations for an Apple store shopper. ${RULES}
- headline: a short, friendly line (max 8 words) introducing the picks.
- picks: 4 products they're likely to want next, mixing items related to what they viewed with good companions to what they own. Never pick something they already bought. Each reason should mention the connection, e.g. "Pairs with your iPhone 17".`,
      schema: objectSchema({ headline: { type: "string" }, picks: pickSchema }),
      content: `Bought: ${signals.purchased.join(", ") || "nothing yet"}\nWishlist: ${signals.wishlist.join(", ") || "empty"}\nRecently viewed: ${signals.recentlyViewed.join(", ") || "nothing"}\n\nCatalog:\n${catalogDigest(candidates)}`,
    })
  );
  return { headline: result.headline, picks: resolvePicks(result.picks, candidates) };
}
