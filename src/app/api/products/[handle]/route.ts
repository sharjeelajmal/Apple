import { NextResponse } from "next/server";
import { getProductByHandle, toFullProduct } from "@/lib/catalog";

export async function GET(_request: Request, { params }: RouteContext<"/api/products/[handle]">) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  return NextResponse.json(toFullProduct(product));
}
