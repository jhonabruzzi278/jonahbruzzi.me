import { restApiFetch } from "./client";
import type { WCCoupon, Coupon } from "./types";

function mapCoupon(raw: WCCoupon): Coupon {
  return {
    _id: raw.id,
    title: raw.description || raw.code.toUpperCase(),
    discountPercentage: Number(raw.amount),
    endTime: raw.date_expires as string,
    minimumAmount: Number(raw.minimum_amount || "0"),
    couponCode: raw.code,
  };
}

// Coupons change rarely — revalidate periodically instead of hitting
// WooCommerce on every request (see client.ts for why).
const COUPONS_REVALIDATE_SECONDS = 300;

export async function listActiveCoupons(): Promise<Coupon[]> {
  const raw = await restApiFetch<WCCoupon[]>(
    "/coupons?per_page=100&status=publish",
    undefined,
    COUPONS_REVALIDATE_SECONDS
  );
  return raw
    .filter((coupon) => coupon.discount_type === "percent" && coupon.date_expires)
    .map(mapCoupon);
}
