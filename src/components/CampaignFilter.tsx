import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { setBudgetRange, resetFilters } from "../features/campaignSlice";

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

  // Handler to reset the filters to their initial state
  const handleResetFilters = () => {
    dispatch(resetFilters()); // Dispatch resetFilters action to clear filters
  };

  return (
    <div>
      <div>
        <label>Budget Range (From):</label>
        <input
          type="number"
          value={filters.budgetRange ? filters.budgetRange[0] || "" : ""}
          onChange={(e) => handleBudgetRangeChange(e, 0)} // Handle change for "From" field
          placeholder="Enter min budget"
        />
      </div>
      <div>
        <label>Budget Range (To):</label>
        <input
          type="number"
          value={filters.budgetRange ? filters.budgetRange[1] || "" : ""}
          onChange={(e) => handleBudgetRangeChange(e, 1)} // Handle change for "To" field
          placeholder="Enter max budget"
        />
      </div>

      {/* Reset filters button */}
      <button onClick={handleResetFilters}>Reset Filters</button>
    </div>
  );
};

export default CampaignFilter;
