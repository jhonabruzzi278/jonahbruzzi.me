import { NextResponse } from "next/server";
import { getShowingProducts } from "@services/productService";

// Filters are forwarded as-is to WooCommerce Store API's own `/products`
// query params (category/tag expect slugs, matching WordPress's taxonomy
// term slugs — see menu-data.js for the real slugs in use).
const FORWARDED_PARAMS = [
  "category",
  "tag",
  "search",
  "min_price",
  "max_price",
  "orderby",
  "order",
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params: Record<string, string> = {};
  for (const key of FORWARDED_PARAMS) {
    const value = searchParams.get(key);
    if (value) params[key] = value;
  }

  try {
    const data = await getShowingProducts(params);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Failed to load products" },
      { status: 502 }
    );
  }
}
