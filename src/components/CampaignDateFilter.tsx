import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { setStartDate, setEndDate } from "../features/campaignSlice"; // Actions for setting dates

const CampaignDateFilter: React.FC = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.campaign); // Get current filters from Redux store

  // Handle start date filter change
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setStartDate(e.target.value)); // Dispatch action to set start date
  };

  // Handle end date filter change
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setEndDate(e.target.value)); // Dispatch action to set end date
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <label
        style={{
          fontWeight: "bold",
          display: "inline-block",
          marginRight: "10px",
        }}
      >
        Filter by Date Range:
      </label>
      <div>
        <label style={{ marginRight: "10px" }}>Start Date:</label>
        <input
          type="date"
          value={filters.startDate || ""}
          onChange={handleStartDateChange}
          style={{
            padding: "5px",
            marginRight: "15px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <label style={{ marginRight: "10px" }}>End Date:</label>
        <input
          type="date"
          value={filters.endDate || ""}
          onChange={handleEndDateChange}
          style={{
            padding: "5px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>
    </div>
  );
};

export default CampaignDateFilter;
