import { configureStore } from "@reduxjs/toolkit";

import filtersReducer from "./slices/filtersSlice";
import ticketReducer from "./slices/ticketsSlice";

export const store = configureStore({
  reducer: { tickets: ticketReducer, filters: filtersReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
