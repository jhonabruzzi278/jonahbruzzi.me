import { apiSlice } from "src/redux/api/apiSlice";
import { userLoggedIn } from "./authSlice";

function persistAuth(token, user) {
  localStorage.setItem("auth", JSON.stringify({ accessToken: token, user }));
}

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          persistAuth(result.data.token, result.data.user);
          dispatch(
            userLoggedIn({ accessToken: result.data.token, user: result.data.user })
          );
        } catch (err) {
          // do nothing
        }
      },
    }),

    // login
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          persistAuth(result.data.token, result.data.user);
          dispatch(
            userLoggedIn({ accessToken: result.data.token, user: result.data.user })
          );
        } catch (err) {
          // do nothing
        }
      },
    }),

    // get current user (validates the token server-side)
    getUser: builder.query({
      query: () => "/me",

      async onQueryStarted(arg, { queryFulfilled, dispatch, getState }) {
        try {
          const result = await queryFulfilled;
          const token = getState()?.auth?.accessToken;
          dispatch(userLoggedIn({ accessToken: token, user: result.data.user }));
        } catch (err) {
          // do nothing — use-auth-check.js handles the invalid-token case
        }
      },
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    confirmForgotPassword: builder.mutation({
      query: (data) => ({
        url: "/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/change-password",
        method: "POST",
        body: data,
      }),
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/profile",
        method: "PUT",
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch, getState }) {
        try {
          const result = await queryFulfilled;
          const token = getState()?.auth?.accessToken;
          persistAuth(token, result.data.user);
          dispatch(userLoggedIn({ accessToken: token, user: result.data.user }));
        } catch (err) {
          // do nothing
        }
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetUserQuery,
  useResetPasswordMutation,
  useConfirmForgotPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
} = authApi;
