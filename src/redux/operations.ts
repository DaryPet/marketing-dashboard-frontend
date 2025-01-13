import { Dispatch } from "redux";
import { setTokens } from "./authSlice";

export const login =
  (username: string, password: string) => async (dispatch: Dispatch) => {
    try {
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
       
        dispatch(setTokens({ access: data.access, refresh: data.refresh }));
       
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login", error);
    }
  };
