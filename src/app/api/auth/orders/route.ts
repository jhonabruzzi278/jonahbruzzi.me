import { NextResponse } from "next/server";
import { getCurrentUser } from "@services/authService";
import { fetchCustomerOrders } from "@services/orderService";

function tokenFromRequest(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
}

export async function GET(request: Request) {
  const token = tokenFromRequest(request);
  if (!token) {
    return NextResponse.json({ message: "Missing token" }, { status: 401 });
  }
  const user = await getCurrentUser(token);
  if (!user) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }
  try {
    const { orders, stats } = await fetchCustomerOrders(user.id);
    return NextResponse.json({ orders, ...stats });
  } catch (err) {
    console.error("[auth/orders]", err);
    return NextResponse.json({ message: "Failed to load orders" }, { status: 502 });
  }
}
