import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { setBudgetRange } from "../features/campaignSlice";

const CampaignFilter: React.FC = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.campaign); // Get the campaign filter state from Redux

  // Handler for budget range change (both "From" and "To" fields)
  const handleBudgetRangeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newBudgetRange = [...(filters.budgetRange || [0, 0])]; // Clone the existing budget range or initialize with [0, 0]
    const value = e.target.value; // Get the input value as a string

    // If the input value is empty, set it to 0; otherwise, parse it as a number
    newBudgetRange[index] = value ? parseFloat(value) : 0;
    dispatch(setBudgetRange(newBudgetRange as [number, number])); // Dispatch action to update the budget range in Redux store
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
      <div className="mb-4">
        <label className="block text-yellow-100">Budget Range (From):</label>
        <input
          type="number"
          value={filters.budgetRange ? filters.budgetRange[0] || "" : ""}
          onChange={(e) => handleBudgetRangeChange(e, 0)} // Handle change for "From" field
          placeholder="Enter min budget"
          className="mt-2 px-4 py-2 w-full bg-gray-700 text-light-yellow border border-gray-600 rounded-lg focus:outline-none focus:ring-2  focus:ring-purple-400"
        />
      </div>
      <div className="mb-4">
        <label className="block text-yellow-100">Budget Range (To):</label>
        <input
          type="number"
          value={filters.budgetRange ? filters.budgetRange[1] || "" : ""}
          onChange={(e) => handleBudgetRangeChange(e, 1)} // Handle change for "To" field
          placeholder="Enter max budget"
          className="mt-2 px-4 py-2 w-full bg-gray-700 text-light-yellow border border-gray-600 rounded-lg focus:outline-none focus:ring-2  focus:ring-purple-400"
        />
      </div>
    </div>
  );
};

export default CampaignFilter;
