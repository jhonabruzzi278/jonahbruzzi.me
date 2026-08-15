import { storeApiFetchWithHeaders } from "./client";
import { buildHeaders, ensureSession } from "./cart";
import type { CartSession } from "./cart";
import type { WCStoreAddress, WCStoreCheckoutResponse } from "./types";

export interface CheckoutResult {
  orderId: number;
  orderKey: string;
  status: string;
  paymentStatus: string;
  redirectUrl?: string;
  session: CartSession;
}

export async function submitCheckout(
  billingAddress: WCStoreAddress,
  shippingAddress: WCStoreAddress,
  paymentMethod: string,
  customerNote: string,
  session: CartSession = {}
): Promise<CheckoutResult> {
  const primedSession = await ensureSession(session);
  const { data, cartToken, nonce, cookie } =
    await storeApiFetchWithHeaders<WCStoreCheckoutResponse>("/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...buildHeaders(primedSession),
      },
      body: JSON.stringify({
        billing_address: billingAddress,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        customer_note: customerNote,
      }),
    });

  return {
    orderId: data.order_id,
    orderKey: data.order_key,
    status: data.status,
    paymentStatus: data.payment_result?.payment_status,
    redirectUrl: data.payment_result?.redirect_url,
    session: {
      cartToken: cartToken ?? primedSession.cartToken,
      nonce: nonce ?? primedSession.nonce,
      cookie: cookie ?? primedSession.cookie,
    },
  };
}
