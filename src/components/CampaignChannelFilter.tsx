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
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
      <label className="block text-xl font-semibold text-light-yellow mb-4">
        Filter by Channel
      </label>
      <div className="space-y-3">
        {availableChannels.map((channel) => (
          <div key={channel} className="flex items-center">
            <input
              type="checkbox"
              id={channel}
              value={channel}
              checked={filters.channels.includes(channel)}
              onChange={handleChannelFilterChange}
              className="mr-2 h-4 w-4 text-yellow-100 border-gray-600 rounded focus:ring-2 focus:ring-light-yellow"
            />
            <label htmlFor={channel}>{channel}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignChannelFilter;
