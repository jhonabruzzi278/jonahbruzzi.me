import { NextResponse } from "next/server";
import { placeOrder } from "@services/checkoutService";

export async function POST(request: Request) {
  const {
    billingAddress,
    shippingAddress,
    paymentMethod,
    customerNote,
    cartToken,
    nonce,
    cookie,
  } = await request.json();
  try {
    const result = await placeOrder(
      billingAddress,
      shippingAddress,
      paymentMethod,
      customerNote ?? "",
      { cartToken, nonce, cookie }
    );
    return NextResponse.json({
      orderId: result.orderId,
      orderKey: result.orderKey,
      status: result.status,
      paymentStatus: result.paymentStatus,
      redirectUrl: result.redirectUrl,
      ...result.session,
    });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json(
      { message: "Failed to place order" },
      { status: 502 }
    );
  }
}
