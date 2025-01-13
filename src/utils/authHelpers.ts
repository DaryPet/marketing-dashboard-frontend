import { store } from "../app/store";
import { setTokens, clearTokens } from "../redux/authSlice";

export const refreshToken = async () => {
  const state = store.getState();
  const refreshToken = state.auth.refreshToken;

  if (!refreshToken) return;

  const response = await fetch("http://localhost:8000/api/token/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  const data = await response.json();

  if (response.ok) {
    store.dispatch(setTokens({ access: data.access, refresh: data.refresh }));
  } else {
    store.dispatch(clearTokens());
  }
};
