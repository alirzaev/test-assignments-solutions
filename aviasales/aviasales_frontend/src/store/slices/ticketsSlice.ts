import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getTickets } from "../../utils/api";
import { Ticket } from "../../utils/types";

interface TicketsState {
  tickets: Ticket[];
  isFetching: boolean;
}

const initialState: TicketsState = {
  tickets: [],
  isFetching: false,
};

export const fetchTickets = createAsyncThunk<Ticket[], void>(
  "tickets/fetchTickets",
  async (_, { rejectWithValue }) => {
    try {
      const tickets = await getTickets();

      return tickets;
    } catch (error) {
      return rejectWithValue([]);
    }
  }
);

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTickets.pending, (state) => {
      state.tickets = [];
      state.isFetching = true;
    });
    builder.addCase(fetchTickets.fulfilled, (state, action) => {
      state.tickets = action.payload;
      state.isFetching = false;
    });
    builder.addCase(fetchTickets.rejected, (state) => {
      state.tickets = [];
      state.isFetching = false;
    });
  },
});

export default ticketsSlice.reducer;
