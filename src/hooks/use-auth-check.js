import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userLoggedIn, userLoggedOut } from "src/redux/features/auth/authSlice";
import { authApi } from "src/redux/features/auth/authApi";

export default function useAuthCheck() {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const localAuth = localStorage?.getItem("auth");

    if (!localAuth) {
      setAuthChecked(true);
      return;
    }

    const auth = JSON.parse(localAuth);
    if (!auth?.accessToken) {
      setAuthChecked(true);
      return;
    }

    // Trust the cached user for the first render (avoids a login flash),
    // then verify the token server-side — a stale/expired/forged token in
    // localStorage should not be treated as a valid session.
    dispatch(userLoggedIn({ accessToken: auth.accessToken, user: auth.user }));

    dispatch(authApi.endpoints.getUser.initiate())
      .unwrap()
      .catch(() => {
        dispatch(userLoggedOut());
      })
      .finally(() => {
        setAuthChecked(true);
      });
  }, [dispatch]);

  return authChecked;
}
