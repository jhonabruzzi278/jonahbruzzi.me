import { describe, it, expect, vi, beforeEach } from "vitest";
import type { WCStoreCart } from "./types";

const storeApiFetchWithHeaders = vi.fn();

vi.mock("./client", () => ({
  storeApiFetchWithHeaders: (...args: unknown[]) =>
    storeApiFetchWithHeaders(...args),
}));

// Imported after the mock so cart.ts picks up the mocked "./client".
const { buildHeaders, getCart, ensureSession, addCartItem, updateCartItem } =
  await import("./cart");

function makeRawCart(overrides: Partial<WCStoreCart> = {}): WCStoreCart {
  return {
    items: [],
    items_count: 0,
    coupons: [],
    totals: {
      total_items: "0",
      total_price: "0",
      total_discount: "0",
      currency_minor_unit: 2,
    },
    needs_shipping: false,
    shipping_rates: [],
    ...overrides,
  };
}

beforeEach(() => {
  storeApiFetchWithHeaders.mockReset();
});

describe("buildHeaders", () => {
  it("returns an empty object for a fresh session with no fields", () => {
    expect(buildHeaders({})).toEqual({});
  });

  it("sets only the headers present on the session", () => {
    expect(buildHeaders({ cartToken: "tok" })).toEqual({ "Cart-Token": "tok" });
    expect(buildHeaders({ nonce: "n" })).toEqual({ Nonce: "n" });
    expect(buildHeaders({ cookie: "wp_woocommerce_session=abc" })).toEqual({
      Cookie: "wp_woocommerce_session=abc",
    });
  });

  it("sets all three headers when the session is fully established", () => {
    expect(
      buildHeaders({ cartToken: "tok", nonce: "n", cookie: "c=1" })
    ).toEqual({ "Cart-Token": "tok", Nonce: "n", Cookie: "c=1" });
  });
});

describe("getCart", () => {
  it("forwards the session as request headers and returns the merged session", async () => {
    storeApiFetchWithHeaders.mockResolvedValue({
      data: makeRawCart(),
      cartToken: "new-token",
      nonce: "new-nonce",
      cookie: "new-cookie",
    });

    const result = await getCart({ cartToken: "old-token" });

    expect(storeApiFetchWithHeaders).toHaveBeenCalledWith("/cart", {
      headers: { "Cart-Token": "old-token" },
    });
    expect(result.session).toEqual({
      cartToken: "new-token",
      nonce: "new-nonce",
      cookie: "new-cookie",
    });
  });

  it("keeps the prior session value for any field the response doesn't return", async () => {
    storeApiFetchWithHeaders.mockResolvedValue({
      data: makeRawCart(),
      // no cartToken/nonce/cookie in the response this time
    });

    const result = await getCart({
      cartToken: "kept-token",
      nonce: "kept-nonce",
      cookie: "kept-cookie",
    });

    expect(result.session).toEqual({
      cartToken: "kept-token",
      nonce: "kept-nonce",
      cookie: "kept-cookie",
    });
  });
});

describe("ensureSession", () => {
  it("does not hit the network when the session already has a nonce and cookie", async () => {
    const session = { cartToken: "t", nonce: "n", cookie: "c" };
    const result = await ensureSession(session);

    expect(storeApiFetchWithHeaders).not.toHaveBeenCalled();
    expect(result).toBe(session);
  });

  it("primes the session with a GET /cart when the nonce is missing", async () => {
    storeApiFetchWithHeaders.mockResolvedValue({
      data: makeRawCart(),
      cartToken: "primed-token",
      nonce: "primed-nonce",
      cookie: "primed-cookie",
    });

    const result = await ensureSession({});

    expect(storeApiFetchWithHeaders).toHaveBeenCalledTimes(1);
    expect(storeApiFetchWithHeaders).toHaveBeenCalledWith("/cart", {
      headers: {},
    });
    expect(result).toEqual({
      cartToken: "primed-token",
      nonce: "primed-nonce",
      cookie: "primed-cookie",
    });
  });

  it("primes the session when the cookie is missing even if a nonce is present", async () => {
    storeApiFetchWithHeaders.mockResolvedValue({
      data: makeRawCart(),
      cartToken: "t",
      nonce: "n",
      cookie: "primed-cookie",
    });

    await ensureSession({ nonce: "stale-nonce" });

    expect(storeApiFetchWithHeaders).toHaveBeenCalledTimes(1);
  });
});

describe("writeCart (via addCartItem)", () => {
  it("primes an unestablished session before writing, then sends the primed headers", async () => {
    storeApiFetchWithHeaders
      // priming GET /cart triggered by ensureSession
      .mockResolvedValueOnce({
        data: makeRawCart(),
        cartToken: "primed-token",
        nonce: "primed-nonce",
        cookie: "primed-cookie",
      })
      // the actual POST /cart/add-item
      .mockResolvedValueOnce({
        data: makeRawCart({ items_count: 1 }),
        cartToken: "primed-token",
        nonce: "primed-nonce",
        cookie: "primed-cookie",
      });

    const result = await addCartItem(42, 1, {});

    expect(storeApiFetchWithHeaders).toHaveBeenCalledTimes(2);
    expect(storeApiFetchWithHeaders).toHaveBeenNthCalledWith(2, "/cart/add-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cart-Token": "primed-token",
        Nonce: "primed-nonce",
        Cookie: "primed-cookie",
      },
      body: JSON.stringify({ id: 42, quantity: 1 }),
    });
    expect(result.cart.itemsCount).toBe(1);
  });

  it("skips priming and writes directly when the session is already established", async () => {
    storeApiFetchWithHeaders.mockResolvedValue({
      data: makeRawCart(),
      cartToken: "t",
      nonce: "n",
      cookie: "c",
    });

    await updateCartItem("item-key", 3, { cartToken: "t", nonce: "n", cookie: "c" });

    expect(storeApiFetchWithHeaders).toHaveBeenCalledTimes(1);
    expect(storeApiFetchWithHeaders).toHaveBeenCalledWith("/cart/update-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cart-Token": "t",
        Nonce: "n",
        Cookie: "c",
      },
      body: JSON.stringify({ key: "item-key", quantity: 3 }),
    });
  });
});
