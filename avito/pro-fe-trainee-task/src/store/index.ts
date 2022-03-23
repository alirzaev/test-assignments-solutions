import { configureStore } from "@reduxjs/toolkit";

import searchReducer from "./slices/searchSlice";
import repositoryReducer from "./slices/repositorySlice";

export const store = configureStore({
  reducer: {
    search: searchReducer,
    reposiory: repositoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
