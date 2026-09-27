import { writeFileSync } from "node:fs";
import { extract } from "./extract-catalog.mjs";
import { parseCompare } from "./parse-compare.mjs";

const range = (n) => Array.from({ length: n }, (_, i) => i);
const sizes = (rows, index) => {
  const row = rows.find((r) => r.name === "Display: Case Size");
  return [...new Set([...(row?.items[index]?.text ?? "").matchAll(/(\d{2})mm/g)].map((m) => `${m[1]}mm`))].sort();
};
const macStorage = (rows, index) => {
  const start = rows.findIndex((r) => r.type === "specs" && r.name === "Storage");
  return [...new Set([...(rows[start + 1].items[index]?.text ?? "").matchAll(/(\d+)\s?(GB|TB)/g)].map((m) => `${m[1]}${m[2]}`))];
};

const catalog = {
  iphone: extract("iphone", { finishRow: 8, storageRows: [82, 83], priceRowName: "Price", summaryHeaders: ["Summary"], pick: range(20) }),
  ipad: extract("ipad", { storageRows: [64, 65, 66, 67, 68], priceRowName: "Price", summaryHeaders: ["Summary"], pick: [0, 1, 2, 3, 4, 5, 6, 13, 20, 21, 22, 23, 29, 7, 14, 35, 24, 30, 8, 15] }),
  watch: extract("watch", { finishRow: 4, storageRowFromText: sizes, priceRowName: "Price", summaryHeaders: ["Summary"], pick: range(14) }),
  mac: extract("mac", { storageRowFromText: macStorage, priceRowName: "", summaryHeaders: ["Compute", "Memory", "Display", "Power and Battery"], pick: [0, 1, 2, 3, 4, 5, 6, 7, 8, 12, 21, 22, 23, 28, 29, 9, 13, 24, 25, 30] }),
};
writeFileSync("catalog-raw.json", JSON.stringify(catalog, null, 2));
for (const [category, products] of Object.entries(catalog)) {
  console.log(`== ${category} (${products.length})`);
  for (const p of products) {
    const bad = p.colors.filter((c) => !c.hex || !c.image).map((c) => c.name + (c.hex ? "" : "[hex]") + (c.image ? "" : "[img]"));
    console.log(" ", p.name.padEnd(36), `${p.colors.length}c`, (p.storages.join(",") || "NO-STORAGE").padEnd(28), p.priceToken ?? "-", bad.length ? "MISSING " + bad.join(",") : "", p.specs.length + "specs");
  }
}
