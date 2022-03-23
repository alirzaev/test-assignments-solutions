import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { searchGitHubRepositories } from "../../utils/api";
import { SearchResults } from "../../utils/types";

interface SearchState {
  isFetching: boolean;
  repos: SearchResults;
  error?: string;
  input: string;
  page: number;
}

const initialState: SearchState = {
  isFetching: false,
  repos: {
    total_count: 0,
    incomplete_results: false,
    items: [],
  },
  error: "",
  input: "",
  page: 1,
};

interface SearchReposPayload {
  input: string;
  page: number;
}

export const searchRepos = createAsyncThunk<SearchResults, SearchReposPayload>(
  "search/searchRepos",
  async ({ input, page }, { rejectWithValue }) => {
    try {
      return searchGitHubRepositories(input, page);
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response?.data?.message);
      } else {
        return rejectWithValue("Unknown error");
      }
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchField: (state, action: PayloadAction<string>) => {
      state.input = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(searchRepos.pending, (state, action) => {
      state.isFetching = true;
      state.input = action.meta.arg.input;
      state.page = action.meta.arg.page;
    });
    builder.addCase(searchRepos.fulfilled, (state, action) => {
      state.isFetching = false;
      state.repos = action.payload;
    });
    builder.addCase(searchRepos.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.payload as string;
      state.repos = {
        total_count: 0,
        incomplete_results: false,
        items: [],
      };
    });
  },
});

export const { setSearchField } = searchSlice.actions;

export default searchSlice.reducer;
