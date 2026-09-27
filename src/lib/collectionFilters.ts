import type { ProductCardData } from "@/types/catalog";
import type { Availability } from "./catalog";

export type CollectionFilters = {
  q: string;
  availability?: Availability;
  minPrice?: number;
  maxPrice?: number;
};

type SearchParams = Record<string, string | string[] | undefined>;

const MAX_QUERY_LENGTH = 60;

const readParam = (params: SearchParams, key: string) => {
  const value = params[key];
  return typeof value === "string" ? value.trim() : "";
};

const readPrice = (params: SearchParams, key: string) => {
  const value = Number(readParam(params, key));
  return readParam(params, key) && Number.isFinite(value) && value >= 0 ? value : undefined;
};

export const parseCollectionFilters = (params: SearchParams): CollectionFilters => {
  const availability = readParam(params, "availability");
  return {
    q: readParam(params, "q").slice(0, MAX_QUERY_LENGTH),
    availability: availability === "in-stock" || availability === "out-of-stock" ? availability : undefined,
    minPrice: readPrice(params, "minPrice"),
    maxPrice: readPrice(params, "maxPrice"),
  };
};

const matchesQuery = (product: ProductCardData, query: string) =>
  !query || query.toLowerCase().split(/\s+/).every((word) => product.title.toLowerCase().includes(word));

const matchesPrice = (product: ProductCardData, { minPrice, maxPrice }: CollectionFilters) =>
  (minPrice === undefined || product.price >= minPrice) && (maxPrice === undefined || product.price <= maxPrice);

const matchesAvailability = (product: ProductCardData, availability?: Availability) =>
  !availability || (availability === "in-stock" ? !product.isSoldOut : Boolean(product.isSoldOut));

export const applyCollectionFilters = (products: ProductCardData[], filters: CollectionFilters) => {
  const beforeAvailability = products.filter((product) => matchesQuery(product, filters.q) && matchesPrice(product, filters));

  return {
    products: beforeAvailability.filter((product) => matchesAvailability(product, filters.availability)),
    availabilityCounts: {
      "in-stock": beforeAvailability.filter((product) => !product.isSoldOut).length,
      "out-of-stock": beforeAvailability.filter((product) => product.isSoldOut).length,
    } satisfies Record<Availability, number>,
    highestPrice: Math.ceil(Math.max(0, ...products.map((product) => product.price))),
  };
};
