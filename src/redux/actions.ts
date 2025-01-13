export const setAuthToken = (token: string) => {
  return {
    type: "SET_TOKEN",
    payload: token,
  };
};

export const clearAuthToken = () => {
  return {
    type: "CLEAR_TOKEN",
  };
};
