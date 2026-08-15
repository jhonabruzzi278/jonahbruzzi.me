import { NextResponse } from "next/server";
import { fetchOrder } from "@services/orderService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const key = new URL(request.url).searchParams.get("key");
  if (!key) {
    return NextResponse.json({ message: "Missing order key" }, { status: 400 });
  }
  try {
    const order = await fetchOrder(Number(id), key);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (err) {
    console.error("[orders/[id]]", err);
    return NextResponse.json(
      { message: "Failed to load order" },
      { status: 502 }
    );
  }
}
