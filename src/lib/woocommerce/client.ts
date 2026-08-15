import "server-only";

// Guarded by the "server-only" import above: bundling this file into a
// client component fails the build, so WOOCOMMERCE_CONSUMER_SECRET can never
// reach the browser even indirectly.

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL;
const WOOCOMMERCE_CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const WOOCOMMERCE_CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

function requireStoreUrl(): string {
  if (!WOOCOMMERCE_URL) {
    throw new Error("WOOCOMMERCE_URL is not configured");
  }
  return WOOCOMMERCE_URL;
}

async function parseOrThrow(res: Response, label: string) {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${label} ${res.status}: ${body}`);
  }
  return res.json();
}

/**
 * Public storefront reads (products, categories) — no credentials required.
 * Used server-side only (Route Handlers) to avoid needing CORS configured
 * on the WordPress side, since admin.jonahbruzzi.me and jonahbruzzi.me are
 * different origins.
 */
/**
 * Public, non-personalized reads (products, categories, coupons) are cached
 * at the origin's revalidate window instead of "no-store" — the host's
 * connection-flood protection was intermittently dropping concurrent
 * requests to admin.jonahbruzzi.me, and fetching on every single page load
 * multiplied outbound connections for data that rarely changes.
 */
export async function storeApiFetch<T>(
  path: string,
  init?: RequestInit,
  revalidateSeconds?: number
): Promise<T> {
  const url = `${requireStoreUrl()}/wp-json/wc/store/v1${path}`;
  const res = await fetch(url, {
    ...init,
    headers: { Accept: "application/json", ...init?.headers },
    ...(revalidateSeconds
      ? { next: { revalidate: revalidateSeconds } }
      : { cache: "no-store" }),
  });
  return parseOrThrow(res, "WooCommerce Store API error");
}

export interface StoreApiResult<T> {
  data: T;
  cartToken?: string;
  nonce?: string;
  cookie?: string;
}

/**
 * WooCommerce's cart session resolution isn't fully carried by Cart-Token
 * alone on every install — it also sets a `wp_woocommerce_session_*`
 * cookie, and without resending that cookie the server can resolve a
 * different/empty cart on the next stateless request even with a valid
 * Cart-Token. Extract just the name=value pairs (drop attributes like
 * Path/Expires/HttpOnly, which are meaningless to resend as a request
 * Cookie header).
 */
function extractCookiePairs(res: Response): string | undefined {
  const raw =
    typeof res.headers.getSetCookie === "function"
      ? res.headers.getSetCookie()
      : (res.headers.get("set-cookie") ? [res.headers.get("set-cookie") as string] : []);
  if (raw.length === 0) return undefined;
  const pairs = raw.map((entry) => entry.split(";")[0].trim());
  return pairs.join("; ");
}

/**
 * Same as storeApiFetch, but also surfaces the `Cart-Token`/`Nonce`
 * response headers and session cookie WooCommerce's cart endpoints use to
 * track a headless session across stateless requests — see
 * lib/woocommerce/cart.ts.
 */
export async function storeApiFetchWithHeaders<T>(
  path: string,
  init?: RequestInit
): Promise<StoreApiResult<T>> {
  const url = `${requireStoreUrl()}/wp-json/wc/store/v1${path}`;
  const res = await fetch(url, {
    ...init,
    headers: { Accept: "application/json", ...init?.headers },
    cache: "no-store",
  });
  const data = await parseOrThrow(res, "WooCommerce Store API error");
  return {
    data,
    cartToken: res.headers.get("cart-token") ?? undefined,
    nonce: res.headers.get("nonce") ?? undefined,
    cookie: extractCookiePairs(res),
  };
}

/**
 * Authenticated admin/write operations — requires consumer key/secret.
 * Server-only; never call from a "use client" component.
 */
export async function restApiFetch<T>(
  path: string,
  init?: RequestInit,
  revalidateSeconds?: number
): Promise<T> {
  if (!WOOCOMMERCE_CONSUMER_KEY || !WOOCOMMERCE_CONSUMER_SECRET) {
    throw new Error("WooCommerce REST API credentials are not configured");
  }
  const auth = Buffer.from(
    `${WOOCOMMERCE_CONSUMER_KEY}:${WOOCOMMERCE_CONSUMER_SECRET}`
  ).toString("base64");
  const url = `${requireStoreUrl()}/wp-json/wc/v3${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${auth}`,
      ...init?.headers,
    },
    ...(revalidateSeconds
      ? { next: { revalidate: revalidateSeconds } }
      : { cache: "no-store" }),
  });
  return parseOrThrow(res, "WooCommerce REST API error");
}
