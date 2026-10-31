import "server-only";
import { connection } from "next/server";
import { getCategoryName } from "@/config/categories";
import type { CatalogProduct } from "@/types/catalog";
import { productsCollection, toCatalogProduct } from "./catalog";

const MAX_QUERY_LENGTH = 80;

type IndexedProduct = {
  product: CatalogProduct;
  titleTokens: string[];
  tokens: string[];
};

export type SearchResult = {
  products: CatalogProduct[];
  correctedQuery: string | null;
};

export const normalizeQuery = (query: string) => query.trim().slice(0, MAX_QUERY_LENGTH);

const tokenize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[‐-―]/g, "-")
    .replace(/(\d)\s*(gb|tb|mm)\b/g, "$1$2")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

const editDistance = (a: string, b: string) => {
  if (Math.abs(a.length - b.length) > 2) return 3;
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    previous = current;
  }
  return previous[b.length];
};

const allowedTypos = (token: string) => (token.length >= 7 ? 2 : token.length >= 4 ? 1 : 0);

const scoreToken = (queryToken: string, productToken: string) => {
  if (productToken === queryToken) return 3;
  if (productToken.startsWith(queryToken)) return 2;
  if (/\d/.test(queryToken)) return 0;
  return editDistance(queryToken, productToken) <= allowedTypos(queryToken) ? 1 : 0;
};

const indexProduct = (product: CatalogProduct): IndexedProduct => {
  const titleTokens = tokenize(product.title);
  return {
    product,
    titleTokens,
    tokens: [
      ...new Set([
        ...titleTokens,
        ...tokenize(getCategoryName(product.category)),
        ...tokenize(product.type),
        ...product.availableStorages.flatMap(tokenize),
        ...product.availableColors.flatMap((color) => tokenize(color.name)),
      ]),
    ],
  };
};

const bestMatch = (queryToken: string, tokens: string[]) => {
  let best = { score: 0, token: "" };
  for (const token of tokens) {
    const score = scoreToken(queryToken, token);
    if (score > best.score) best = { score, token };
    if (score === 3) break;
  }
  return best;
};

export async function searchCatalog(rawQuery: string): Promise<SearchResult> {
  await connection();
  const queryTokens = tokenize(normalizeQuery(rawQuery));
  if (!queryTokens.length) return { products: [], correctedQuery: null };

  const documents = await productsCollection.find({ status: "active" }).sort({ createdAt: -1 }).toArray();
  const index = documents.map((document) => indexProduct(toCatalogProduct(document)));

  const matches = index.flatMap((entry) => {
    const results = queryTokens.map((token) => bestMatch(token, entry.tokens));
    if (results.some((result) => result.score === 0)) return [];

    const titleBonus = queryTokens.filter((token) => entry.titleTokens.some((t) => t.startsWith(token))).length;
    const score = results.reduce((total, result) => total + result.score, 0) + titleBonus;
    return [{ entry, score, corrections: results.map((result) => result.token) }];
  });

  matches.sort((a, b) => b.score - a.score);

  const usedTypoCorrection = matches.length > 0 && matches[0].corrections.some((token, i) => token !== queryTokens[i] && !token.startsWith(queryTokens[i]));
  const correctedQuery = usedTypoCorrection ? matches[0].corrections.join(" ") : null;

  return { products: matches.map((match) => match.entry.product), correctedQuery };
}
