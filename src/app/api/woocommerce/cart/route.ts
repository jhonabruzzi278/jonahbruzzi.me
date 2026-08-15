import { NextResponse } from "next/server";
import { fetchCart } from "@services/cartService";

// "Cookie" is a forbidden header name for browser fetch() — the browser
// sends the WooCommerce session cookie value under X-Cart-Cookie instead,
// and this route relays it to WooCommerce as a real Cookie header
// server-side (not subject to that browser restriction).
function sessionFromRequest(request: Request) {
  return {
    cartToken: request.headers.get("cart-token") ?? undefined,
    nonce: request.headers.get("nonce") ?? undefined,
    cookie: request.headers.get("x-cart-cookie") ?? undefined,
  };
}

export async function GET(request: Request) {
  try {
    const { cart, session } = await fetchCart(sessionFromRequest(request));
    return NextResponse.json({ cart, ...session });
  } catch (err) {
    console.error("[cart]", err);
    return NextResponse.json(
      { message: "Failed to load cart" },
      { status: 502 }
    );
  }
}
