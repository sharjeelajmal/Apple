import "server-only";
import type { CatalogProduct } from "@/types/catalog";
import { cacheKey, cachedAi } from "../cache";
import { describeProductInDetail } from "../catalogContext";
import { generateJson, objectSchema, stringArray } from "../generateJson";

export type ProductComparison = {
  summary: string;
  rows: { feature: string; values: string[] }[];
  picks: { need: string; handle: string; reason: string }[];
};

const CACHE_HOURS = 24 * 7;

const schema = objectSchema({
  summary: { type: "string" },
  rows: { type: "array", items: objectSchema({ feature: { type: "string" }, values: stringArray }) },
  picks: {
    type: "array",
    items: objectSchema({ need: { type: "string" }, handle: { type: "string" }, reason: { type: "string" } }),
  },
});

const SYSTEM = `You compare Apple products for shoppers of an online store. Use only the product data provided; when a spec is not in the data, write "Not listed" instead of guessing.
Write in plain, friendly English that a non-technical shopper understands.
- summary: two short sentences on how these products differ overall.
- rows: 7 to 9 rows covering price, display, chip/performance, camera (if relevant), battery/size, storage options, colors and anything else that matters for these products. Each row has one short value per product, in the same order the products are given.
- picks: 3 or 4 shopper needs (for example "Best camera", "Best value", "Most portable"), each naming the handle of the best product for that need and a one-sentence reason.`;

export async function compareProducts(products: CatalogProduct[]) {
  const key = cacheKey("compare", products.map((product) => [product.handle, product.updatedAt]));

  const comparison = await cachedAi(key, CACHE_HOURS, () =>
    generateJson<ProductComparison>({
      system: SYSTEM,
      schema,
      content: `Compare these products, in this order:\n\n${products.map(describeProductInDetail).join("\n\n")}`,
    })
  );

  const handles = new Set(products.map((product) => product.handle));
  return {
    ...comparison,
    rows: comparison.rows.map((row) => ({ ...row, values: products.map((_, index) => row.values[index] ?? "—") })),
    picks: comparison.picks.filter((pick) => handles.has(pick.handle)),
  };
}
