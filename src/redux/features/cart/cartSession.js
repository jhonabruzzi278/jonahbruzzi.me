const TOKEN_KEY = "wc_cart_token";
const NONCE_KEY = "wc_cart_nonce";
const COOKIE_KEY = "wc_cart_cookie";

export function getCartSession() {
  if (typeof window === "undefined") return {};
  return {
    cartToken: localStorage.getItem(TOKEN_KEY) || undefined,
    nonce: localStorage.getItem(NONCE_KEY) || undefined,
    cookie: localStorage.getItem(COOKIE_KEY) || undefined,
  };
}

export function setCartSession({ cartToken, nonce, cookie }) {
  if (typeof window === "undefined") return;
  if (cartToken) localStorage.setItem(TOKEN_KEY, cartToken);
  if (nonce) localStorage.setItem(NONCE_KEY, nonce);
  if (cookie) localStorage.setItem(COOKIE_KEY, cookie);
}
