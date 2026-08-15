import { NextResponse } from "next/server";
import { addItem } from "@services/cartService";

export async function POST(request: Request) {
  const { id, quantity, cartToken, nonce, cookie } = await request.json();
  try {
    const { cart, session } = await addItem(id, quantity ?? 1, {
      cartToken,
      nonce,
      cookie,
    });
    return NextResponse.json({ cart, ...session });
  } catch (err) {
    console.error("[cart/add-item]", err);
    return NextResponse.json(
      { message: "Failed to add item to cart" },
      { status: 502 }
    );
  }
}
