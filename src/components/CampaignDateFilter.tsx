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
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-semibold text-yellow-100 mb-4">
        Filter by Date Range
      </h2>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center">
          <label className="text-yellow-100 mr-4">Start Date:</label>
          <input
            type="date"
            value={filters.startDate || ""}
            onChange={handleStartDateChange}
            className="px-4 py-2 bg-gray-700 text-yellow-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2  focus:ring-purple-400"
          />
        </div>
        <div className="flex items-center">
          <label className="text-yellow-100 mr-4">End Date:</label>
          <input
            type="date"
            value={filters.endDate || ""}
            onChange={handleEndDateChange}
            className="px-4 py-2 bg-gray-700 text-yellow-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2  focus:ring-purple-400"
          />
        </div>
      </div>
    </div>
  );
};

export default CampaignDateFilter;
