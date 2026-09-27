import { readFileSync, writeFileSync } from "node:fs";
import { parseCompare } from "./parse-compare.mjs";

const tokensIn = (item) => [...(Array.isArray(item) ? item.map((x) => x.text).join(" ") : item?.text ?? "").matchAll(/\{([A-Z0-9_]+)\}/g)].map((m) => m[1]);
const collect = (category, rowIndexes) => {
  const { rows } = parseCompare(`compare_${category}.html`);
  return rowIndexes.flatMap((i) => rows[i].items.flatMap(tokensIn));
};

const tokens = [
  ...collect("iphone", [4, 82, 83, 84, 85]),
  ...collect("ipad", [19]),
  ...collect("watch", [7]),
  ...collect("mac", [34]),
];
const unique = [...new Set(tokens)];
const response = await fetch(`https://www.apple.com/us/shop/mcm/product-price?parts=${unique.join(",")}`, { headers: { "User-Agent": "Mozilla/5.0" } });
const { items } = await response.json();
const prices = Object.fromEntries(Object.entries(items).map(([id, value]) => [id, { name: value.name, price: value.price?.value ?? null }]));
writeFileSync("live-prices.json", JSON.stringify(prices, null, 2));
for (const [id, { name, price }] of Object.entries(prices)) console.log(id.padEnd(26), String(price).padEnd(8), name);
console.log(`${Object.keys(prices).length} of ${unique.length} tokens priced`);
