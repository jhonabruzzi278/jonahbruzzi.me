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

export async function listActiveCoupons(): Promise<Coupon[]> {
  const raw = await restApiFetch<WCCoupon[]>(
    "/coupons?per_page=100&status=publish"
  );
  return raw
    .filter((coupon) => coupon.discount_type === "percent" && coupon.date_expires)
    .map(mapCoupon);
}
