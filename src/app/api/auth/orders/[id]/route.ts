import { NextResponse } from "next/server";
import { getCurrentUser } from "@services/authService";
import { fetchCustomerOrder } from "@services/orderService";

function tokenFromRequest(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = tokenFromRequest(request);
  if (!token) {
    return NextResponse.json({ message: "Missing token" }, { status: 401 });
  }
  const user = await getCurrentUser(token);
  if (!user) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }
  try {
    const order = await fetchCustomerOrder(user.id, Number(id));
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (err) {
    console.error("[auth/orders/[id]]", err);
    return NextResponse.json({ message: "Failed to load order" }, { status: 502 });
  }
}
