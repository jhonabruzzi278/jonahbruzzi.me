import { NextResponse } from "next/server";
import { setCoupon } from "@services/cartService";

export async function POST(request: Request) {
  const { code, remove, cartToken, nonce, cookie } = await request.json();
  try {
    const { cart, session } = await setCoupon(code, Boolean(remove), {
      cartToken,
      nonce,
      cookie,
    });
    return NextResponse.json({ cart, ...session });
  } catch (err) {
    console.error("[cart/coupon]", err);
    return NextResponse.json(
      { message: "Failed to apply coupon" },
      { status: 502 }
    );
  }
}
