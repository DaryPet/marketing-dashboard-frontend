import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

interface PrivateRouteProps {
  element: React.ReactNode;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, path }) => {
  const { accessToken, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Route path={path} element={element} />;
};

export default PrivateRoute;
