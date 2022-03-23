import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getGitHubRepository } from "../../utils/api";
import { RepositoryExtended } from "../../utils/types";

interface RepositoryState {
  isFetching: boolean;
  repo?: RepositoryExtended;
  error?: string;
}

const initialState: RepositoryState = {
  isFetching: true,
  error: "",
};

export const fetchRepository = createAsyncThunk(
  "repository/fetchRepository",
  async (fullName: string, { rejectWithValue }) => {
    try {
      return getGitHubRepository(fullName);
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response?.data?.message);
      } else {
        return rejectWithValue("Unknown error");
      }
    }
  }
);

const repositorySlice = createSlice({
  name: "repository",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRepository.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(fetchRepository.fulfilled, (state, action) => {
      state.isFetching = false;
      state.repo = action.payload;
    });
    builder.addCase(fetchRepository.rejected, (state, action) => {
      state.isFetching = false;
      state.repo = undefined;
      state.error = action.payload as string;
    });
  },
});

export default repositorySlice.reducer;
