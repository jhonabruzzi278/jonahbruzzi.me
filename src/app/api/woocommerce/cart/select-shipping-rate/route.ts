import { NextResponse } from "next/server";
import { selectRate } from "@services/cartService";

export async function POST(request: Request) {
  const { rate_id, cartToken, nonce, cookie } = await request.json();
  try {
    const { cart, session } = await selectRate(rate_id, {
      cartToken,
      nonce,
      cookie,
    });
    return NextResponse.json({ cart, ...session });
  } catch (err) {
    console.error("[cart/select-shipping-rate]", err);
    return NextResponse.json(
      { message: "Failed to select shipping rate" },
      { status: 502 }
    );
  }
}
