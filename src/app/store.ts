import { configureStore } from "@reduxjs/toolkit";
import { campaignApi } from "../services/campaignApi";
import campaignReducer from "../features/campaignSlice";
// create Store
export const store = configureStore({
  reducer: {
    // Add RTK Query API reducer
    [campaignApi.reducerPath]: campaignApi.reducer,
    // Add campaign slice reducer for filters and local state
    campaign: campaignReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(campaignApi.middleware),
});

// for typescript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
