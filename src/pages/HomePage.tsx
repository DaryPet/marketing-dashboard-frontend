import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import CampaignList from "../components/CampaignTable";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  // Retrieve authentication status from Redux store
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]); // Effect runs whenever `isAuthenticated` or `navigate` changes

  // Redirect the user to the login page
  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {!isAuthenticated && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 text-center">
          <p className="text-xl text-yellow-100 mb-4">
            Want to manage campaigns? Please log in!
          </p>
          <button
            onClick={handleLoginRedirect}
            className="bg-yellow-100 text-dark-blue py-2 px-6 rounded-lg hover:bg-yellow-200 transition duration-300"
          >
            Log In
          </button>
        </div>
      )}
      <CampaignList />
    </div>
  );
};

export default HomePage;
