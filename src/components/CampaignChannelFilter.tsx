import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { setChannels } from "../features/campaignSlice"; // Action to update selected channels

const CampaignChannelFilter: React.FC = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.campaign); // Get current filters from Redux store

  // List of available channels to filter by (can be dynamic if needed)
  const availableChannels = ["TV", "Radio", "Social Media", "Search Engine"];

  // Handle channel filter change
  const handleChannelFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = e.target;

    // Update the channels array depending on whether the checkbox was checked or unchecked
    let updatedChannels;
    if (checked) {
      // Add the channel to the list
      updatedChannels = [...filters.channels, value];
    } else {
      // Remove the channel from the list
      updatedChannels = filters.channels.filter((channel) => channel !== value);
    }

    // Dispatch action to update the selected channels in Redux
    dispatch(setChannels(updatedChannels));
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <label
        style={{
          cursor: "pointer",
          fontWeight: "bold",
          color: "#007bff",
          display: "inline-block",
          marginBottom: "10px",
        }}
      >
        Filter by Channel
      </label>
      <div style={{ marginTop: "10px" }}>
        {availableChannels.map((channel) => (
          <div key={channel}>
            <input
              type="checkbox"
              id={channel}
              value={channel}
              checked={filters.channels.includes(channel)}
              onChange={handleChannelFilterChange}
              style={{ marginRight: "5px" }}
            />
            <label htmlFor={channel}>{channel}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignChannelFilter;
