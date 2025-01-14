import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

// Define the props for the PrivateRoute component
interface PrivateRouteProps {
  element: React.ReactNode;
  path: string;
}
// Component to handle protected routes
const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, path }) => {
  // Access authentication state from the Redux store
  const { accessToken, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  // If the user is not authenticated or the access token is missing,
  // redirect them to the login page
  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/login" replace />;
  }
  // If authenticated, render the desired route
  return <Route path={path} element={element} />;
};

export default PrivateRoute;
