import { NextResponse } from "next/server";
import { getProduct } from "@services/productService";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const product = await getProduct(id);
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }
}
