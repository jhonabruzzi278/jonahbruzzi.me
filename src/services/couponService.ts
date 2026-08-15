import { listActiveCoupons } from "@lib/woocommerce/coupons";
import type { Coupon } from "@lib/woocommerce/types";

export async function getOfferCoupons(): Promise<Coupon[]> {
  return listActiveCoupons();
}
