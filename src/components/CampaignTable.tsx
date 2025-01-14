import React, { useState } from "react";
import { useGetCampaignsQuery } from "../services/campaignApi";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import CampaignFilter from "./CampaignFilter";
import CampaignChannelFilter from "./CampaignChannelFilter";
import CampaignDateFilter from "./CampaignDateFilter";
import { useDispatch } from "react-redux";
import { resetFilters } from "../features/campaignSlice";

const CampaignList: React.FC = () => {
  const dispatch = useDispatch();
  const { data, error, isLoading } = useGetCampaignsQuery(); // Fetch campaigns using RTK Query
  const filters = useSelector((state: RootState) => state.campaign); // Get filters from Redux store

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // State for sorting campaigns by budget

  // If data is loading, show loading indicator
  if (isLoading) return <div>Loading...</div>;

  // If there's an error loading the campaigns
  if (error) return <div>Error loading campaigns: {JSON.stringify(error)}</div>;

  // If no campaigns available, display a message
  if (!data || data.length === 0) {
    return <div>No campaigns available</div>;
  }

  // Sort campaigns by budget
  const handleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc")); // Toggle sorting order
  };

  // Filter campaigns based on the budget range
  const filteredData = (data || []).filter((campaign) => {
    let matchesBudget = true;
    let matchesChannels = true;
    let matchesStartDate = true;
    let matchesEndDate = true;

    // Filter by "From" budget (if set)
    if (filters.budgetRange && filters.budgetRange[0] !== undefined) {
      matchesBudget = campaign.plannedBudget >= filters.budgetRange[0];
    }

    // Filter by "To" budget (if set)
    if (filters.budgetRange && filters.budgetRange[1] !== undefined) {
      matchesBudget =
        matchesBudget && campaign.plannedBudget <= filters.budgetRange[1];
    }

    // Filter by selected channels (if set)
    if (filters.channels.length > 0) {
      matchesChannels = filters.channels.every((channel) =>
        campaign.channels.includes(channel)
      );
    }
    // Filter by start date (if set)
    if (filters.startDate) {
      matchesStartDate =
        new Date(campaign.startDate) >= new Date(filters.startDate);
    }
    // Filter by end date (if set)
    if (filters.endDate) {
      matchesEndDate = new Date(campaign.endDate) <= new Date(filters.endDate);
    }

    // Return the campaign if it matches both budget and channel filters
    return (
      matchesBudget && matchesChannels && matchesStartDate && matchesEndDate
    );
  });

  // Sort filtered campaigns by budget
  const sortedData = [...filteredData].sort((a, b) => {
    if (a.plannedBudget < b.plannedBudget) return sortOrder === "asc" ? -1 : 1;
    if (a.plannedBudget > b.plannedBudget) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
  // Handler for reset filters
  const handleResetFilters = () => {
    dispatch(resetFilters()); // Dispatch resetFilters action to clear filters
  };

  return (
    <div className="p-6 bg-gray-900 text-yellow-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center">Campaigns</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <CampaignFilter /> {/* Include the CampaignFilter component */}
        <CampaignChannelFilter /> {/* Filter component for channels */}
        <CampaignDateFilter /> {/* Filter component for date */}
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="text-center w-full">
          <span className="text-lg">Sorted by Planned Budget</span>
          <span
            className="cursor-pointer ml-2 text-xl"
            onClick={handleSort} // Toggle sort order on click
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </span>
        </div>
      </div>
      <button
        onClick={handleResetFilters}
        className="mt-4 mb-4 px-6 py-2 bg-purple-400 text-white rounded-lg hover:bg-purple-700 transition mx-auto block"
      >
        Reset Filters
      </button>
      {filteredData.length === 0 && (
        <div className="text-center text-lg text-yellow-100 mt-6">
          No results found for your search.
        </div>
      )}

      <table className="min-w-full table-auto border-collapse border border-gray-600">
        <thead>
          <tr className="bg-gray-800 text-yellow-100">
            <th className="py-3 px-4 border-b">Name</th>
            <th className="py-3 px-4 border-b">Start Date</th>
            <th className="py-3 px-4 border-b">End Date</th>
            <th className="py-3 px-4 border-b">Planned Budget</th>
            <th className="py-3 px-4 border-b">Spent Budget</th>
            <th className="py-3 px-4 border-b">Channels</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((campaign) => (
            <tr key={campaign.id}>
              <td className="py-3 px-4 border-b">{campaign.name}</td>
              <td className="py-3 px-4 border-b">{campaign.startDate}</td>
              <td className="py-3 px-4 border-b">{campaign.endDate}</td>
              <td className="py-3 px-4 border-b">{campaign.plannedBudget}</td>
              <td className="py-3 px-4 border-b">{campaign.spentBudget}</td>
              <td className="py-3 px-4 border-b">
                {campaign.channels.join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignList;
