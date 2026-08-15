import { storeApiFetchWithHeaders } from "./client";
import { mapStoreCart } from "./mappers";
import type { WCStoreCart, Cart } from "./types";

export interface CartSession {
  cartToken?: string;
  nonce?: string;
  cookie?: string;
}

export interface CartResult {
  cart: Cart;
  session: CartSession;
}

export function buildHeaders(session: CartSession): Record<string, string> {
  const headers: Record<string, string> = {};
  if (session.cartToken) headers["Cart-Token"] = session.cartToken;
  if (session.nonce) headers["Nonce"] = session.nonce;
  // Cart-Token alone isn't always sufficient to resolve the same cart on
  // this WooCommerce install — resend the session cookie it also sets.
  if (session.cookie) headers["Cookie"] = session.cookie;
  return headers;
}

function toResult(
  data: WCStoreCart,
  result: { cartToken?: string; nonce?: string; cookie?: string },
  session: CartSession
): CartResult {
  return {
    cart: mapStoreCart(data),
    session: {
      cartToken: result.cartToken ?? session.cartToken,
      nonce: result.nonce ?? session.nonce,
      cookie: result.cookie ?? session.cookie,
    },
  };
}

export async function getCart(session: CartSession = {}): Promise<CartResult> {
  const { data, cartToken, nonce, cookie } = await storeApiFetchWithHeaders<WCStoreCart>(
    "/cart",
    { headers: buildHeaders(session) }
  );
  return toResult(data, { cartToken, nonce, cookie }, session);
}

/**
 * Store API requires a `Nonce` header (obtained from a prior GET /cart) on
 * every write. A fresh browser session won't have one yet, so writes
 * transparently prime the session with a GET first when needed.
 */
export async function ensureSession(session: CartSession): Promise<CartSession> {
  if (session.nonce && session.cookie) return session;
  const primed = await getCart(session);
  return primed.session;
}

async function writeCart(
  path: string,
  body: Record<string, unknown>,
  session: CartSession
): Promise<CartResult> {
  const primedSession = await ensureSession(session);
  const { data, cartToken, nonce, cookie } = await storeApiFetchWithHeaders<WCStoreCart>(
    path,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...buildHeaders(primedSession),
      },
      body: JSON.stringify(body),
    }
  );
  return toResult(data, { cartToken, nonce, cookie }, primedSession);
}

export async function addCartItem(
  id: number,
  quantity: number,
  session: CartSession = {}
): Promise<CartResult> {
  return writeCart("/cart/add-item", { id, quantity }, session);
}

export async function updateCartItem(
  key: string,
  quantity: number,
  session: CartSession = {}
): Promise<CartResult> {
  return writeCart("/cart/update-item", { key, quantity }, session);
}

export async function removeCartItem(
  key: string,
  session: CartSession = {}
): Promise<CartResult> {
  return writeCart("/cart/remove-item", { key }, session);
}

export async function applyCoupon(
  code: string,
  session: CartSession = {}
): Promise<CartResult> {
  return writeCart("/cart/apply-coupon", { code }, session);
}

export async function removeCoupon(
  code: string,
  session: CartSession = {}
): Promise<CartResult> {
  return writeCart("/cart/remove-coupon", { code }, session);
}

export async function selectShippingRate(
  rateId: string,
  session: CartSession = {}
): Promise<CartResult> {
  return writeCart(
    "/cart/select-shipping-rate",
    { package_id: 0, rate_id: rateId },
    session
  );
}
