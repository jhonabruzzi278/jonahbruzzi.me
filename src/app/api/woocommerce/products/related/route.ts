import { NextResponse } from "next/server";
import { getRelatedProducts } from "@services/productService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tags = (searchParams.get("tags") ?? "").split(",").filter(Boolean);
  const excludeId = searchParams.get("excludeId") ?? undefined;

  try {
    const data = await getRelatedProducts(tags, excludeId);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Failed to load related products" },
      { status: 502 }
    );
  }
}
