import { apiSlice } from "src/redux/api/apiSlice";
import { getCartSession, setCartSession } from "./cartSession";

// Concurrent requests against the same Cart-Token race on the WordPress
// side (its cart session storage isn't safe for parallel stateless hits —
// observed as WooCommerce returning an empty cart / "item doesn't exist"
// under concurrency) — so every cart call is chained through this queue to
// guarantee only one is ever in flight, however many components (mini-cart,
// cart page, header count) call useGetCartQuery/mutations at once.
let cartQueue = Promise.resolve();
function enqueueCartRequest(fn) {
  const result = cartQueue.then(fn, fn);
  cartQueue = result.catch(() => {});
  return result;
}

// WooCommerce's Store API cart is server-side session state (Cart-Token +
// Nonce + a session cookie) — queryFn is used here instead of a declarative
// `query` so each call can attach/refresh the full session.
// GET reads the session from request headers (see
// app/api/woocommerce/cart/route.ts); POST reads it from the JSON body
// (see the other cart routes) since it's already sending a body anyway —
// both must actually carry the session or the server-side proxy silently
// re-primes a brand new WooCommerce cart on every write.
async function cartRequestOnce(path, body, returnFull = false) {
  const session = getCartSession();
  const isGet = !body;
  const res = await fetch(`/api/woocommerce${path}`, {
    method: isGet ? "GET" : "POST",
    headers: {
      "Content-Type": "application/json",
      ...(isGet && session.cartToken ? { "Cart-Token": session.cartToken } : {}),
      ...(isGet && session.nonce ? { Nonce: session.nonce } : {}),
      ...(isGet && session.cookie ? { "X-Cart-Cookie": session.cookie } : {}),
    },
    body: isGet ? undefined : JSON.stringify({ ...body, ...session }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Cart request failed");
  }
  setCartSession({
    cartToken: json.cartToken,
    nonce: json.nonce,
    cookie: json.cookie,
  });
  return returnFull ? json : json.cart;
}

// One transparent retry (re-fetching the cart to resync the session first)
// on top of the queue above, in case a session still goes stale for other
// reasons (expired nonce, etc).
async function cartRequest(path, body, returnFull = false) {
  return enqueueCartRequest(async () => {
    try {
      return await cartRequestOnce(path, body, returnFull);
    } catch (err) {
      if (!body) throw err;
      await cartRequestOnce("/cart");
      return cartRequestOnce(path, body, returnFull);
    }
  });
}

function asQueryFn(path, buildBody) {
  return {
    queryFn: async (arg) => {
      try {
        const cart = await cartRequest(path, buildBody ? buildBody(arg) : {});
        return { data: cart };
      } catch (err) {
        return { error: { status: "CUSTOM_ERROR", error: err.message } };
      }
    },
    invalidatesTags: ["Cart"],
  };
}

export const cartApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCart: builder.query({
      queryFn: async () => {
        try {
          const cart = await cartRequest("/cart");
          return { data: cart };
        } catch (err) {
          return { error: { status: "CUSTOM_ERROR", error: err.message } };
        }
      },
      providesTags: ["Cart"],
    }),
    addCartItem: builder.mutation(
      asQueryFn("/cart/add-item", ({ id, quantity = 1 }) => ({ id, quantity }))
    ),
    updateCartItem: builder.mutation(
      asQueryFn("/cart/update-item", ({ key, quantity }) => ({ key, quantity }))
    ),
    removeCartItem: builder.mutation(
      asQueryFn("/cart/remove-item", ({ key }) => ({ key }))
    ),
    applyCartCoupon: builder.mutation(
      asQueryFn("/cart/coupon", ({ code }) => ({ code }))
    ),
    removeCartCoupon: builder.mutation(
      asQueryFn("/cart/coupon", ({ code }) => ({ code, remove: true }))
    ),
    selectShippingRate: builder.mutation(
      asQueryFn("/cart/select-shipping-rate", ({ rateId }) => ({
        rate_id: rateId,
      }))
    ),
    submitCheckout: builder.mutation({
      queryFn: async (checkoutData) => {
        try {
          const result = await enqueueCartRequest(() =>
            cartRequestOnce("/checkout", checkoutData, true)
          );
          return { data: result };
        } catch (err) {
          return { error: { status: "CUSTOM_ERROR", error: err.message } };
        }
      },
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useApplyCartCouponMutation,
  useRemoveCartCouponMutation,
  useSelectShippingRateMutation,
  useSubmitCheckoutMutation,
} = cartApi;
