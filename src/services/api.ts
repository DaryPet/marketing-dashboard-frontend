import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../app/store";

const baseQuery = fetchBaseQuery({
  // baseUrl: "http://localhost:8000/api/",
  baseUrl: "http://localhost:8080/api/",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Campaign"],
  endpoints: (builder) => ({
    getCampaigns: builder.query({
      query: () => "campaigns/",
      providesTags: ["Campaign"],
    }),

    getCampaignById: builder.query({
      query: (id) => `campaigns/${id}/`,
      providesTags: ["Campaign"],
    }),

    // Создание новой кампании
    createCampaign: builder.mutation({
      query: (newCampaign) => ({
        url: "campaigns/",
        method: "POST",
        body: newCampaign,
      }),
      invalidatesTags: ["Campaign"],
    }),

    updateCampaign: builder.mutation({
      query: ({ id, updatedCampaign }) => ({
        url: `campaigns/${id}/`,
        method: "PUT",
        body: updatedCampaign,
      }),
      invalidatesTags: ["Campaign"],
    }),

    deleteCampaign: builder.mutation({
      query: (id) => ({
        url: `campaigns/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Campaign"],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useGetCampaignByIdQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
} = api;
