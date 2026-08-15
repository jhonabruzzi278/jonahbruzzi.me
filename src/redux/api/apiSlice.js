import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Same-origin Next.js Route Handlers proxying WooCommerce — keeps the
// WooCommerce REST consumer secret server-side and avoids needing CORS
// configured on the WordPress side.
const wooCommerceBaseQuery = fetchBaseQuery({
  baseUrl: "/api/woocommerce",
});

// Same-origin Route Handlers proxying WordPress auth — forwards the Bearer
// token for endpoints that need to identify the current user (getMe,
// updateProfile, order history).
const authBaseQuery = fetchBaseQuery({
  baseUrl: "/api/auth",
  prepareHeaders: async (headers, { getState }) => {
    const token = getState()?.auth?.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const AUTH_ENDPOINTS = new Set([
  "loginUser",
  "registerUser",
  "getUser",
  "updateProfile",
  "changePassword",
  "getMyOrders",
  "getMyOrderById",
  "resetPassword",
  "confirmForgotPassword",
]);

const dynamicBaseQuery = (args, api, extraOptions) => {
  const baseQuery = AUTH_ENDPOINTS.has(api.endpoint)
    ? authBaseQuery
    : wooCommerceBaseQuery;
  return baseQuery(args, api, extraOptions);
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: dynamicBaseQuery,
  tagTypes: ["Category", "Products", "Discount", "Coupon", "Product","RelatedProducts", "Cart"],
  endpoints: (builder) => ({}),
});
