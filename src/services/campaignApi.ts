import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Interface for a single campaign
export interface Campaign {
  id: string;
  name: string;
  channels: string[];
  startDate: string;
  endDate: string;
  plannedBudget: number;
  spentBudget: number;
}

// Interface for API response (snake_case fields)
export interface CampaignApiResponse {
  id: string;
  name: string;
  start_date: string; // start_date is in snake_case from the API
  end_date: string; // end_date is in snake_case from the API
  total_budget: string; // total_budget as string from the API
  spent_budget: string; // spent_budget as string from the API
  // channels: string[];
  channels: { id: number; name: string }[];
}

// Define the API service
export const campaignApi = createApi({
  reducerPath: "campaignApi", // Unique key for the API in the Redux store
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/" }), // Base URL for the backend API

  tagTypes: ["Campaign"], // Tags for cache invalidation
  endpoints: (builder) => ({
    // Fetch all campaigns
    getCampaigns: builder.query<Campaign[], void>({
      query: () => "campaigns/", // Backend endpoint

      transformResponse: (response: CampaignApiResponse[]) => {
        console.log("Raw Data from API:", response); // Log raw response

        return response.map((campaigns) => ({
          id: campaigns.id,
          name: campaigns.name,
          channels: campaigns.channels.map((channel) => channel.name),
          // channels: campaigns.channels,
          startDate: campaigns.start_date, // Handle start_date
          endDate: campaigns.end_date, // Handle end_date
          plannedBudget: parseFloat(campaigns.total_budget), // Convert total_budget to float
          spentBudget: parseFloat(campaigns.spent_budget), // Convert spent_budget to float
        }));
      },
      providesTags: ["Campaign"], // Links this query to the 'Campaign' tag
    }),
    //  Create a new campaign
    createCampaign: builder.mutation<void, Campaign>({
      query: (newCampaign) => ({
        url: "campaigns/", // Backend endpoint for creating a campaign
        method: "POST", // HTTP method
        body: newCampaign, // Payload for the request
      }),
      invalidatesTags: ["Campaign"], // Refresh campaigns after this mutation
    }),
    // Update an existing campaign
    updateCampaign: builder.mutation<void, { id: string; data: Campaign }>({
      query: ({ id, data }) => ({
        url: `campaigns/${id}/`, // Endpoint for updating a campaign
        method: "PUT", // HTTP method
        body: data, // Updated campaign data
      }),
      invalidatesTags: ["Campaign"], // Refresh campaigns after this mutation
    }),
    // Delete a campaign
    deleteCampaign: builder.mutation<void, string>({
      query: (id) => ({
        url: `campaigns/${id}/`, // Endpoint for deleting a campaign
        method: "DELETE", // HTTP method
      }),
      invalidatesTags: ["Campaign"], // Refresh campaigns after this mutation
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
} = campaignApi;
