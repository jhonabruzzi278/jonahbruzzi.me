import { NextResponse } from "next/server";
import { getOfferCoupons } from "@services/couponService";

export async function GET() {
  try {
    const coupons = await getOfferCoupons();
    return NextResponse.json(coupons);
  } catch (err) {
    console.error("[coupons]", err);
    return NextResponse.json({ message: "Failed to load coupons" }, { status: 502 });
  }
}
