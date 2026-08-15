import { createSlice } from "@reduxjs/toolkit";

// Cart items now live server-side (WooCommerce Store API cart, see
// redux/features/cart/cartApi.js) — this slice only keeps the quantity
// stepper used on product pages before an item is added to the cart.
const initialState = {
  orderQuantity: 1,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    increment: (state) => {
      state.orderQuantity = state.orderQuantity + 1;
    },
    decrement: (state) => {
      state.orderQuantity =
        state.orderQuantity > 1
          ? state.orderQuantity - 1
          : (state.orderQuantity = 1);
    },
    initialOrderQuantity: (state) => {
      state.orderQuantity = 1;
    },
  },
});

export const { increment, decrement, initialOrderQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
