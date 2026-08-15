import { NextResponse } from "next/server";
import { removeItem } from "@services/cartService";

export async function POST(request: Request) {
  const { key, cartToken, nonce, cookie } = await request.json();
  try {
    const { cart, session } = await removeItem(key, { cartToken, nonce, cookie });
    return NextResponse.json({ cart, ...session });
  } catch (err) {
    console.error("[cart/remove-item]", err);
    return NextResponse.json(
      { message: "Failed to remove cart item" },
      { status: 502 }
    );
  }
}
