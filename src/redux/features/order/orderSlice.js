import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shipping_info: {},
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    set_shipping: (state, { payload }) => {
      state.shipping_info = payload;
      localStorage.setItem(
        "shipping_info",
        JSON.stringify(payload)
      );
    },
    get_shipping: (state, { payload }) => {
      const data = localStorage.getItem('shipping_info');
      if (data) {
        state.shipping_info = JSON.parse(data);
      } else {
        state.shipping_info = {};
      }

    },
  },
});

export const {get_shipping,set_shipping} = orderSlice.actions;
export default orderSlice.reducer;
