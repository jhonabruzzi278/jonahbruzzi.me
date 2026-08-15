import { NextResponse } from "next/server";
import { getDiscountProducts } from "@services/productService";

export async function GET() {
  try {
    const data = await getDiscountProducts();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Failed to load discounted products" },
      { status: 502 }
    );
  }
}
