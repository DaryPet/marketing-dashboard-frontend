import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import CampaignList from "../components/CampaignTable";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div>
      <h1>Campaigns</h1>
      {!isAuthenticated && (
        <div style={{ marginBottom: "20px" }}>
          <p>Want to manage campaigns? Please log in!</p>
          <button
            onClick={handleLoginRedirect}
            style={{ padding: "10px 20px" }}
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
