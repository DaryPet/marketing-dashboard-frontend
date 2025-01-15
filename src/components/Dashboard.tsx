import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import LogoutButton from "./Logout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Campaign {
  id?: number;
  name: string;
  start_date: string;
  end_date: string;
  total_budget: string;
  spent_budget: string;
  channels: Channel[];
}

interface Channel {
  name: string;
  type: string;
}

const Dashboard: React.FC = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [channels, setChannels] = useState<Channel[]>([
    { name: "TV", type: "TV" },
    { name: "Radio", type: "Radio" },
    { name: "Social Media", type: "Social Media" },
    { name: "Search Engine", type: "Search Engine" },
  ]);
  const [formData, setFormData] = useState<Campaign>({
    name: "",
    start_date: "",
    end_date: "",
    total_budget: "",
    spent_budget: "",
    channels: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<any>({});

  const formRef = useRef<HTMLFormElement>(null);

  // Fetch campaigns from API when accessToken is available
  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!accessToken) {
        setError("You are not logged in.");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/campaigns/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load campaigns");
        }

        const data = await response.json();
        setCampaigns(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    fetchCampaigns();
  }, [accessToken]); // This effect depends on accessToken

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "channel") {
      const selectedChannels = Array.from(
        (e.target as HTMLSelectElement).selectedOptions,
        (option: HTMLOptionElement) => option.value
      );

      const selectedChannelsData = selectedChannels
        .map((channelName) => {
          return channels.find((channel) => channel.name === channelName);
        })
        .filter(Boolean) as Channel[];

      setFormData((prev) => ({
        ...prev,
        channels: Array.from(
          new Set([...prev.channels, ...selectedChannelsData])
        ),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors: any = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.start_date) errors.start_date = "Start date is required";
    if (!formData.end_date) errors.end_date = "End date is required";
    if (!formData.total_budget)
      errors.total_budget = "Total budget is required";
    if (!formData.spent_budget)
      errors.spent_budget = "Spent budget is required";
    if (formData.channels.length === 0)
      errors.channels = "At least one channel is required";

    return errors;
  };

  // Handle form submission for creating/updating campaign
  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const dataToSend = {
      name: formData.name,
      start_date: formData.start_date,
      end_date: formData.end_date,
      total_budget: formData.total_budget,
      spent_budget: formData.spent_budget,
      channels: formData.channels,
    };

    try {
      const url = isEditing
        ? `http://localhost:8000/api/campaigns/${formData.id}/`
        : "http://localhost:8000/api/campaigns/";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Failed to save campaign");
      }

      const updatedCampaign = await response.json();
      setCampaigns(
        (prev) =>
          isEditing
            ? [
                updatedCampaign,
                ...prev.filter((c) => c.id !== updatedCampaign.id), // Replace updated campaign
              ]
            : [updatedCampaign, ...prev] // Add new campaign to the list
      );

      toast.success(
        isEditing
          ? "Campaign updated successfully!"
          : "Campaign created successfully!"
      );
      // Clear the form after successful submission
      setFormData({
        name: "",
        start_date: "",
        end_date: "",
        total_budget: "",
        spent_budget: "",
        channels: [],
      });
      setIsEditing(false);
      setFormErrors({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Handle deleting a campaign
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/campaigns/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete campaign");
      }

      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      toast.success("Campaign deleted successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Set form data for editing a campaign
  const handleEdit = (campaign: Campaign) => {
    setFormData(campaign);
    setIsEditing(true);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Reset form data and cancel editing
  const handleCancel = () => {
    setFormData({
      name: "",
      start_date: "",
      end_date: "",
      total_budget: "",
      spent_budget: "",
      channels: [],
    });
    setIsEditing(false);
    setFormErrors({});
  };

  // Remove selected channel from the form
  const handleRemoveChannel = (channelToRemove: Channel) => {
    setFormData((prev) => ({
      ...prev,
      channels: prev.channels.filter(
        (channel) => channel.name !== channelToRemove.name
      ),
    }));
  };

  return (
    <div className="p-6 bg-gray-900 text-yellow-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center">Dashboard</h1>
      <div className="flex justify-center mb-6">
        <LogoutButton />
      </div>
      {error && <p className="text-red-500">{error}</p>}

      <form
        className="space-y-4 w-1/2 mx-auto"
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div>
          <label className="text-xl">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-yellow-100 border outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          {formErrors.name && (
            <p className="text-red-500 text-sm">{formErrors.name}</p>
          )}
        </div>
        <div>
          <label className="text-xl">Start Date:</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-yellow-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          {formErrors.start_date && (
            <p className="text-red-500 text-sm">{formErrors.start_date}</p>
          )}
        </div>
        <div>
          <label className="text-xl">End Date:</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-yellow-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          {formErrors.end_date && (
            <p className="text-red-500 text-sm">{formErrors.end_date}</p>
          )}
        </div>
        <div>
          <label className="text-xl">Total Budget:</label>
          <input
            type="number"
            name="total_budget"
            value={formData.total_budget}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-yellow-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          {formErrors.total_budget && (
            <p className="text-red-500 text-sm">{formErrors.total_budget}</p>
          )}
        </div>
        <div>
          <label className="text-xl">Spent Budget:</label>
          <input
            type="number"
            name="spent_budget"
            value={formData.spent_budget}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-yellow-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          {formErrors.spent_budget && (
            <p className="text-red-500 text-sm">{formErrors.spent_budget}</p>
          )}
        </div>
        <div>
          <label className="text-xl">Channel(s):</label>
          <select
            name="channel"
            multiple
            value={formData.channels.map((channel) => channel.name)}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-700 text-yellow-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            {channels.map((channel) => (
              <option key={channel.name} value={channel.name}>
                {channel.name}
              </option>
            ))}
          </select>
          {formErrors.channels && (
            <p className="text-red-500 text-sm">{formErrors.channels}</p>
          )}
        </div>
        <div>
          <h3 className="text-lg">Selected Channels:</h3>
          {formData.channels.map((channel, index) => (
            <div key={index}>
              <span>{channel.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveChannel(channel)}
                className="ml-2 bg-purple-400 text-white rounded p-1 hover:bg-purple-700 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="w-full py-3 mt-4 bg-purple-400 text-white rounded-lg hover:bg-purple-700 transition"
        >
          {isEditing ? "Update Campaign" : "Create Campaign"}
        </button>

        <button
          type="button"
          onClick={handleCancel}
          className="w-full py-3 mt-4 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Cancel
        </button>
      </form>

      <h2 className="text-2xl font-semibold mt-6 text-center">
        Your Campaigns
      </h2>
      <table className="w-full table-auto mt-4 bg-gray-800 text-yellow-100">
        <thead>
          <tr>
            <th className="py-3 px-4 border-b">Name</th>
            <th className="py-3 px-4 border-b">Start Date</th>
            <th className="py-3 px-4 border-b">End Date</th>
            <th className="py-3 px-4 border-b">Total Budget</th>
            <th className="py-3 px-4 border-b">Spent Budget</th>
            <th className="py-3 px-4 border-b">Channels</th>
            <th className="py-3 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.id}>
              <td className="py-3 px-4 border-b">{campaign.name}</td>
              <td className="py-3 px-4 border-b">{campaign.start_date}</td>
              <td className="py-3 px-4 border-b">{campaign.end_date}</td>
              <td className="py-3 px-4 border-b">{campaign.total_budget}</td>
              <td className="py-3 px-4 border-b">{campaign.spent_budget}</td>
              <td className="py-3 px-4 border-b">
                {campaign.channels.map((channel, index) => (
                  <>
                    <span key={`${campaign.id}-${channel.name}-${index}`}>
                      {channel.name}
                    </span>
                    {index < campaign.channels.length - 1 && ", "}
                  </>
                ))}
              </td>
              <td className="py-3 px-4 border-b">
                <button
                  onClick={() => handleEdit(campaign)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(campaign.id!)}
                  className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-700 ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
