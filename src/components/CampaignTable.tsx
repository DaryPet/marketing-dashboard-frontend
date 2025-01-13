import React, { useState } from "react";
import { useGetCampaignsQuery } from "../services/campaignApi";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import CampaignFilter from "./CampaignFilter";
import CampaignChannelFilter from "./CampaignChannelFilter";
import CampaignDateFilter from "./CampaignDateFilter";

const CampaignList: React.FC = () => {
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

  // Filter campaigns based on the budget range set in filters
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

  return (
    <div>
      <h1>Campaigns</h1>
      <div style={{ marginBottom: "10px" }}>
        <span>Sorted by Planned Budget</span>
        <span
          style={{ cursor: "pointer", marginLeft: "10px" }}
          onClick={handleSort} // Toggle sort order on click
        >
          {sortOrder === "asc" ? "↑" : "↓"}
        </span>
      </div>
      <CampaignFilter /> {/* Include the CampaignFilter component */}
      <CampaignChannelFilter /> {/* Filter component for channels */}
      <CampaignDateFilter />
      {/* Filter component for date */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Planned Budget</th>
            <th>Spent Budget</th>
            <th>Channels</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((campaign) => (
            <tr key={campaign.id}>
              <td>{campaign.name}</td>
              <td>{campaign.startDate}</td>
              <td>{campaign.endDate}</td>
              <td>{campaign.plannedBudget}</td>
              <td>{campaign.spentBudget}</td>
              <td>{campaign.channels.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignList;
