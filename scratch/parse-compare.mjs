import { readFileSync } from "node:fs";
export function parseCompare(file) {
  const s = readFileSync(file, "utf8");
  const re = /<div (data-true="true" )?data-type="(products|features|featureItems|specs|extraInfo)" id="[^"]+" class="([^"]*)">\s*(?:<div data-store-value=""([^>]*)>([\s\S]*?)<\/div>)?/g;
  const products = []; const rows = []; let current = null; let group = null; let m;
  const clean = (html) => html.replace(/<sup[\s\S]*?<\/sup>/g, "").replace(/<br\s*\/?>/g, " ").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  while ((m = re.exec(s))) {
    const [, trueAttr, type, cls, attrs = "", inner = ""] = m;
    const present = Boolean(trueAttr);
    const text = clean(inner);
    if (type === "products") products.push(text);
    else if (type !== "featureItems") { current = { name: text, type, items: [] }; rows.push(current); group = null; }
    else if (!current) continue;
    else if (cls.includes("feature-group")) { group = []; current.items.push(group); }
    else if (group) group.push({ text, attrs, html: inner, present });
    else current.items.push({ text, attrs, html: inner, present });
  }
  return { products, rows };
}
