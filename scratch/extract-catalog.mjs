import { readFileSync } from "node:fs";
import { parseCompare } from "./parse-compare.mjs";

const cellText = (item) => (Array.isArray(item) ? item.map((x) => x.text).filter(Boolean).join(" · ") : item?.text ?? "");
const cellValues = (item) => (Array.isArray(item) ? item.map((x) => x.text).filter(Boolean) : item?.text ? [item.text] : []);

export const tokenize = (value) =>
  value
    .toLowerCase()
    .replace(/[‐-―]/g, "-")
    .replace(/generation/g, "gen")
    .replace(/-in\.|\binch\b|\bin\./g, " ")
    .replace(/(\d)\.(\d)/g, "$1 $2")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

function sectionRows(rows, header) {
  const start = rows.findIndex((r) => r.type === "specs" && r.name.startsWith(header));
  if (start < 0) return [];
  const end = rows.findIndex((r, i) => i > start && r.type === "specs");
  return rows.slice(start + 1, end < 0 ? undefined : end);
}

function loadAssets(cssFile) {
  const css = readFileSync(cssFile, "utf8");
  const variables = new Map([...css.matchAll(/(--[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})/g)].map((m) => [m[1], m[2]]));
  const resolveColor = (value) => {
    const hex = value.match(/#[0-9a-fA-F]{3,8}/);
    if (hex) return hex[0];
    const variable = value.match(/var\((--[a-z0-9-]+)\)/);
    return variable ? variables.get(variable[1]) ?? null : null;
  };

  const images = new Map();
  const heroes = new Map();
  const swatches = [];
  for (const [, selectorList, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const url = body.match(/url\("?([^")]*?_large(?:_2x)?\.(?:jpg|png))"?\)/);
    const color = body.match(/background(?:-color)?\s*:\s*([^;]+)/);
    for (const rawSelector of selectorList.split(",")) {
      const selector = rawSelector.split(/[;}]/).pop().trim();
      const image = selector.match(/^\.image-compare-([a-z0-9-]+)$/);
      const hero = selector.match(/^\.image-all-models-([a-z0-9-]+)$/);
      const target = image ? images : hero ? heroes : null;
      const key = (image ?? hero)?.[1];
      if (target && url && (!target.has(key) || url[1].includes("_large_2x"))) target.set(key, "https://www.apple.com" + url[1]);
      const swatch = selector.trim().match(/(?:\.colornav-wrapper-([a-z0-9-]+)\s+)?\.colornav-swatch-([a-z0-9-]+)$/);
      const hex = color && resolveColor(color[1]);
      if (swatch && hex) swatches.push({ key: swatch[2], wrapper: swatch[1] ?? null, hex });
    }
  }
  return { images, heroes, swatches };
}

const expandTokens = (tokens) => {
  const result = new Set(tokens);
  for (let i = 0; i < tokens.length - 1; i++) result.add(tokens[i] + tokens[i + 1]);
  const seIndex = tokens.indexOf("se");
  if (seIndex !== -1) result.add(/^\d+$/.test(tokens[seIndex + 1] ?? "") ? `gen${tokens[seIndex + 1]}` : "gen1");
  return result;
};

const colorTokenSets = (colorName) => {
  const sets = [tokenize(colorName.replace(/\(?product\)?\s*red/i, "red"))];
  if (/product/i.test(colorName)) sets.push(["productred"], ["product", "red"]);
  return sets;
};

const LINE_WORDS = new Set(["se", "ultra", "mini", "plus", "air", "neo", "duo", "e", "series"]);
const isOrdinal = (token) => /^\d+(st|nd|rd|th)$/.test(token);
const hasDigit = (token) => /\d/.test(token);
const REJECTED = { score: -Infinity, matched: 0 };

function scorePrefix(prefixTokens, productTokens, { strict }) {
  const extras = prefixTokens.filter((t) => !productTokens.has(t));
  const productDigits = [...productTokens].filter(hasDigit);
  const productHasOrdinal = productDigits.some(isOrdinal);
  const sharesIdentifier = prefixTokens.some((t) => hasDigit(t) && productTokens.has(t));

  if (strict && productDigits.length && !sharesIdentifier) return REJECTED;
  for (const token of extras) {
    if (LINE_WORDS.has(token)) return REJECTED;
    if (hasDigit(token) && !(isOrdinal(token) && !productHasOrdinal)) return REJECTED;
  }
  const matched = prefixTokens.length - extras.length;
  return { score: matched * 2 - extras.length, matched };
}

function scoreKey(keyTokens, colorTokens, productTokens, options) {
  const remaining = [...keyTokens];
  for (const token of colorTokens) {
    const at = remaining.lastIndexOf(token);
    if (at === -1) {
      const joined = colorTokens.join("");
      const flat = keyTokens.join("");
      if (!flat.endsWith(joined)) return null;
      let consumed = "";
      const prefix = [...keyTokens];
      while (prefix.length && consumed.length < joined.length) consumed = prefix.pop() + consumed;
      return consumed === joined ? scorePrefix(prefix, productTokens, options) : null;
    }
    remaining.splice(at, 1);
  }
  return scorePrefix(remaining, productTokens, options);
}

function bestMatch(entries, productName, colorName, options) {
  const productTokens = expandTokens(tokenize(productName));
  for (const colorTokens of colorTokenSets(colorName)) {
    let best = null;
    for (const [key, value] of entries) {
      const result = scoreKey(key.split("-"), colorTokens, productTokens, options);
      if (!result || result.score === -Infinity || (options.strict && result.matched === 0)) continue;
      if (!best || result.score > best.score) best = { ...result, key, value };
    }
    if (best) return best;
  }
  return null;
}

const findImage = (images, productName, colorName) => {
  const match = bestMatch(images, productName, colorName, { strict: true });
  return match && { url: match.value, key: match.key };
};

const findHex = (swatches, productName, colorName) => {
  const productTokens = expandTokens(tokenize(productName));
  const scoped = swatches.filter(
    (s) => !s.wrapper || scorePrefix(tokenize(s.wrapper), productTokens, { strict: true }).matched >= 2
  );
  const specific = bestMatch(scoped.filter((s) => s.wrapper).map((s) => [s.key, s.hex]), productName, colorName, { strict: false });
  const generic = bestMatch(scoped.filter((s) => !s.wrapper).map((s) => [s.key, s.hex]), productName, colorName, { strict: false });
  return (specific ?? generic)?.value ?? null;
};

const colorsFromFinishSection = (rows, index) =>
  sectionRows(rows, "Finish").filter((r) => r.name && r.items[index]?.present).map((r) => r.name);

export function extract(category, { finishRow, storageRows, storageRowFromText, priceRowName, summaryHeaders, pick }) {
  const { products, rows } = parseCompare(`compare_${category}.html`);
  const { images, heroes, swatches } = loadAssets(`compare_${category}.css`);
  const finish = finishRow === undefined ? null : rows[finishRow];
  const summary = summaryHeaders.flatMap((header) => sectionRows(rows, header));
  const priceRow =
    rows.find((r) => r.name === priceRowName && r.items.length === products.length) ??
    rows.find((r) => r.items.length === products.length && r.items.some((x) => /\{[A-Z0-9_]+\}/.test(cellText(x))));

  return pick.map((index) => {
    const name = products[index];
    const colorNames = finish ? cellValues(finish.items[index]) : colorsFromFinishSection(rows, index);
    const colors = colorNames.map((colorName) => {
      const match = findImage(images, name, colorName);
      return { name: colorName, hex: findHex(swatches, name, colorName), image: match?.url ?? null, imageKey: match?.key ?? null };
    });
    const storages = storageRowFromText
      ? storageRowFromText(rows, index)
      : storageRows.map((i) => cellValues(rows[i].items[index])[0]).filter(Boolean);
    const priceToken = (cellText(priceRow?.items[index]).match(/\{([A-Z0-9_]+)\}/) || [])[1] ?? null;
    const specs = summary.map((r) => cellText(r.items[index])).filter((t) => t && t !== "-" && !/^\{/.test(t) && !/^From\b/.test(t));
    const hero = bestMatch(heroes, name, "", { strict: true });
    return { index, name, hero: hero?.value ?? null, colors, storages: [...new Set(storages)], priceToken, specs: [...new Set(specs)] };
  });
}
