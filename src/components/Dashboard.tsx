import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import LogoutButton from "./Logout";

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

  useEffect(() => {
    const fetchCampaigns = async () => {
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
  }, [accessToken]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "channel") {
      const selectedChannel = channels.find(
        (channel) => channel.name === value
      );
      // Когда выбирается канал, сохраняем и его ID
      setFormData((prev) => ({
        ...prev,
        channels: selectedChannel
          ? [
              {
                name: selectedChannel.name,
                type: selectedChannel.type,
              },
            ]
          : [],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      setCampaigns((prev) =>
        isEditing
          ? prev.map((c) => (c.id === updatedCampaign.id ? updatedCampaign : c))
          : [...prev, updatedCampaign]
      );

      setFormData({
        name: "",
        start_date: "",
        end_date: "",
        total_budget: "",
        spent_budget: "",
        channels: [],
      });
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleEdit = (campaign: Campaign) => {
    setFormData({
      id: campaign.id || undefined,
      name: campaign.name || "",
      start_date: campaign.start_date || "",
      end_date: campaign.end_date || "",
      total_budget: campaign.total_budget || "",
      spent_budget: campaign.spent_budget || "",
      channels: campaign.channels || [],
    });
    setIsEditing(true);
  };
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
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <LogoutButton />
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Total Budget:</label>
          <input
            type="number"
            name="total_budget"
            value={formData.total_budget}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Spent Budget:</label>
          <input
            type="number"
            name="spent_budget"
            value={formData.spent_budget}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Channel:</label>
          <select
            name="channel"
            value={
              formData.channels.length > 0 ? formData.channels[0].name : ""
            }
            onChange={handleChange}
            required
          >
            <option value="">Select Channel</option>
            {channels.map((channel) => (
              <option key={channel.name} value={channel.name}>
                {channel.name} ({channel.type})
              </option>
            ))}
          </select>
        </div>
        <button type="submit">
          {isEditing ? "Update Campaign" : "Create Campaign"}
        </button>

        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </form>

      <h2>Your Campaigns</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Total Budget</th>
            <th>Spent Budget</th>
            <th>Channels</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.id}>
              <td>{campaign.name}</td>
              <td>{campaign.start_date}</td>
              <td>{campaign.end_date}</td>
              <td>{campaign.total_budget}</td>
              <td>{campaign.spent_budget}</td>
              <td>
                {campaign.channels.map((channel) => (
                  <span key={`${campaign.id}-${channel.name}-${channel.type}`}>
                    {channel.name}
                  </span>
                ))}
              </td>
              <td>
                <button onClick={() => handleEdit(campaign)}>Edit</button>
                <button onClick={() => handleDelete(campaign.id!)}>
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
