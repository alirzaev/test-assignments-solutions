import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { SortOrder } from "../../utils/enums";
import { StopType } from "../../utils/types";

interface FiltersState {
  order: SortOrder;
  stops: StopType[];
}

const initialState: FiltersState = {
  order: SortOrder.CHEAPEST,
  stops: [0, 1, 2, 3],
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setStopsCount: (state, action: PayloadAction<Set<StopType>>) => {
      state.stops = Array.from(action.payload);
    },
    setSortOrder: (state, action: PayloadAction<SortOrder>) => {
      state.order = action.payload;
    },
  },
});

export const { setStopsCount, setSortOrder } = filtersSlice.actions;

export default filtersSlice.reducer;
