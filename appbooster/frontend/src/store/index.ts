import { configureStore } from "@reduxjs/toolkit";

import converterReducer from "./slices/converterSlice";
import currenciesReducer from "./slices/currenciesSlice";

export const store = configureStore({
  reducer: {
    converter: converterReducer,
    currencies: currenciesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
