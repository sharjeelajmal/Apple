import { NextResponse, type NextRequest } from "next/server";
import { searchProducts, toCardProduct } from "@/lib/catalog";

const MAX_RESULTS = 8;
const MAX_QUERY_LENGTH = 80;

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") ?? "").trim().slice(0, MAX_QUERY_LENGTH);

  if (!query) {
    return NextResponse.json([]);
  }

  const products = await searchProducts(query, MAX_RESULTS);
  return NextResponse.json(products.map(toCardProduct));
}
