import {
  submitCheckout,
  type CheckoutResult,
} from "@lib/woocommerce/checkout";
import type { CartSession } from "@lib/woocommerce/cart";
import type { WCStoreAddress } from "@lib/woocommerce/types";

export function placeOrder(
  billingAddress: WCStoreAddress,
  shippingAddress: WCStoreAddress,
  paymentMethod: string,
  customerNote: string,
  session: CartSession
): Promise<CheckoutResult> {
  return submitCheckout(
    billingAddress,
    shippingAddress,
    paymentMethod,
    customerNote,
    session
  );
}
