import { describe, it, expect, vi, beforeEach } from "vitest";
import type { WCStoreAddress, WCStoreCart, WCStoreCheckoutResponse } from "./types";

const storeApiFetchWithHeaders = vi.fn();

vi.mock("./client", () => ({
  storeApiFetchWithHeaders: (...args: unknown[]) =>
    storeApiFetchWithHeaders(...args),
}));

// Imported after the mock: submitCheckout pulls in the real cart.ts
// (ensureSession/buildHeaders), which itself imports the mocked "./client"
// — this exercises the real session-priming logic, not a stub of it.
const { submitCheckout } = await import("./checkout");

function makeAddress(overrides: Partial<WCStoreAddress> = {}): WCStoreAddress {
  return {
    first_name: "Jonah",
    last_name: "Bruzzi",
    address_1: "Av. Siempre Viva 123",
    city: "Santiago",
    state: "RM",
    postcode: "8320000",
    country: "CL",
    email: "jonah@example.com",
    phone: "+56911111111",
    ...overrides,
  };
}

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

function makeCheckoutResponse(
  overrides: Partial<WCStoreCheckoutResponse> = {}
): WCStoreCheckoutResponse {
  return {
    order_id: 501,
    status: "processing",
    order_key: "wc_order_abc123",
    payment_result: {
      payment_status: "success",
      payment_details: [],
      redirect_url: "https://admin.jonahbruzzi.me/order-received/501",
    },
    ...overrides,
  };
}

beforeEach(() => {
  storeApiFetchWithHeaders.mockReset();
});

describe("submitCheckout", () => {
  it("skips priming and posts directly when the session is already established", async () => {
    storeApiFetchWithHeaders.mockResolvedValue({
      data: makeCheckoutResponse(),
      cartToken: "t",
      nonce: "n",
      cookie: "c",
    });

    const result = await submitCheckout(
      makeAddress(),
      makeAddress(),
      "cod",
      "Dejar en portería",
      { cartToken: "t", nonce: "n", cookie: "c" }
    );

    expect(storeApiFetchWithHeaders).toHaveBeenCalledTimes(1);
    expect(storeApiFetchWithHeaders).toHaveBeenCalledWith("/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cart-Token": "t",
        Nonce: "n",
        Cookie: "c",
      },
      body: JSON.stringify({
        billing_address: makeAddress(),
        shipping_address: makeAddress(),
        payment_method: "cod",
        customer_note: "Dejar en portería",
      }),
    });

    expect(result).toEqual({
      orderId: 501,
      orderKey: "wc_order_abc123",
      status: "processing",
      paymentStatus: "success",
      redirectUrl: "https://admin.jonahbruzzi.me/order-received/501",
      session: { cartToken: "t", nonce: "n", cookie: "c" },
    });
  });

  it("primes an unestablished session with a GET /cart before submitting the checkout", async () => {
    storeApiFetchWithHeaders
      .mockResolvedValueOnce({
        data: makeRawCart(),
        cartToken: "primed-token",
        nonce: "primed-nonce",
        cookie: "primed-cookie",
      })
      .mockResolvedValueOnce({
        data: makeCheckoutResponse(),
        cartToken: "primed-token",
        nonce: "primed-nonce",
        cookie: "primed-cookie",
      });

    const result = await submitCheckout(
      makeAddress(),
      makeAddress(),
      "bacs",
      "",
      {}
    );

    expect(storeApiFetchWithHeaders).toHaveBeenCalledTimes(2);
    expect(storeApiFetchWithHeaders).toHaveBeenNthCalledWith(1, "/cart", {
      headers: {},
    });
    expect(storeApiFetchWithHeaders).toHaveBeenNthCalledWith(2, "/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cart-Token": "primed-token",
        Nonce: "primed-nonce",
        Cookie: "primed-cookie",
      },
      body: expect.any(String),
    });
    expect(result.session).toEqual({
      cartToken: "primed-token",
      nonce: "primed-nonce",
      cookie: "primed-cookie",
    });
  });

  it("keeps the primed session values when the checkout response doesn't return new ones", async () => {
    storeApiFetchWithHeaders.mockResolvedValue({
      data: makeCheckoutResponse(),
      // no cartToken/nonce/cookie back from the /checkout call itself
    });

    const result = await submitCheckout(makeAddress(), makeAddress(), "cod", "", {
      cartToken: "existing-token",
      nonce: "existing-nonce",
      cookie: "existing-cookie",
    });

    expect(result.session).toEqual({
      cartToken: "existing-token",
      nonce: "existing-nonce",
      cookie: "existing-cookie",
    });
  });

  it("does not throw when payment_result is missing, leaving paymentStatus/redirectUrl undefined", async () => {
    storeApiFetchWithHeaders.mockResolvedValue({
      data: makeCheckoutResponse({
        payment_result: undefined as unknown as WCStoreCheckoutResponse["payment_result"],
      }),
      cartToken: "t",
      nonce: "n",
      cookie: "c",
    });

    const result = await submitCheckout(makeAddress(), makeAddress(), "cod", "", {
      cartToken: "t",
      nonce: "n",
      cookie: "c",
    });

    expect(result.paymentStatus).toBeUndefined();
    expect(result.redirectUrl).toBeUndefined();
    expect(result.orderId).toBe(501);
  });
});
