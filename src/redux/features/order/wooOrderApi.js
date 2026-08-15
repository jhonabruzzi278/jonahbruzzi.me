import { apiSlice } from "src/redux/api/apiSlice";

export const wooOrderApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getMyOrders: builder.query({
      query: () => "/orders",
      keepUnusedDataFor: 600,
    }),
    getMyOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      keepUnusedDataFor: 600,
      transformResponse: (response) => response.order,
    }),
  }),
});

export const { useGetMyOrdersQuery, useGetMyOrderByIdQuery } = wooOrderApi;
