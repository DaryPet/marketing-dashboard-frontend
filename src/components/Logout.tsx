import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearTokens } from "../redux/authSlice";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      // Remove tokens from LocalStorage
      localStorage.removeItem("accessToken");

      // Clear tokens from Redux state
      dispatch(clearTokens());

      // If cookies are used, clear them as well
      Cookies.remove("csrfToken"); // Remove csrfToken if it's stored in cookies
      // Show success toast notification
      toast.success("Logged out successfully!");
      // Redirect to home page
      navigate("/");
    } catch (error) {
      // In case of an error during logout
      toast.error("Error logging out! Please try again.");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-6 py-3 mt-4 bg-purple-400 text-yellow-100 font-semibold rounded-lg hover:bg-purple-700 transition"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
