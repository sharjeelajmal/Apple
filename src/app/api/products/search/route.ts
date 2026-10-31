import { NextResponse, type NextRequest } from "next/server";
import { toCardProduct } from "@/lib/catalog";
import { normalizeQuery, searchCatalog } from "@/lib/search";

const MAX_RESULTS = 6;

export async function GET(request: NextRequest) {
  const query = normalizeQuery(request.nextUrl.searchParams.get("q") ?? "");

  if (!query) {
    return NextResponse.json({ products: [], total: 0, correctedQuery: null });
  }

  const { products, correctedQuery } = await searchCatalog(query);
  return NextResponse.json({
    products: products.slice(0, MAX_RESULTS).map(toCardProduct),
    total: products.length,
    correctedQuery,
  });
}
