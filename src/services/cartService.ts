import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  applyCoupon,
  removeCoupon,
  selectShippingRate,
  type CartSession,
  type CartResult,
} from "@lib/woocommerce/cart";

export function fetchCart(session: CartSession): Promise<CartResult> {
  return getCart(session);
}

export function addItem(
  id: number,
  quantity: number,
  session: CartSession
): Promise<CartResult> {
  return addCartItem(id, quantity, session);
}

export function updateItem(
  key: string,
  quantity: number,
  session: CartSession
): Promise<CartResult> {
  return updateCartItem(key, quantity, session);
}

export function removeItem(key: string, session: CartSession): Promise<CartResult> {
  return removeCartItem(key, session);
}

export function setCoupon(
  code: string,
  remove: boolean,
  session: CartSession
): Promise<CartResult> {
  return remove ? removeCoupon(code, session) : applyCoupon(code, session);
}

export function selectRate(
  rateId: string,
  session: CartSession
): Promise<CartResult> {
  return selectShippingRate(rateId, session);
}
