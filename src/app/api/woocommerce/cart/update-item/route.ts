import { NextResponse } from "next/server";
import { updateItem } from "@services/cartService";

export async function POST(request: Request) {
  const { key, quantity, cartToken, nonce, cookie } = await request.json();
  try {
    const { cart, session } = await updateItem(key, quantity, {
      cartToken,
      nonce,
      cookie,
    });
    return NextResponse.json({ cart, ...session });
  } catch (err) {
    console.error("[cart/update-item]", err);
    return NextResponse.json(
      { message: "Failed to update cart item" },
      { status: 502 }
    );
  }
}
