import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { RootState } from "..";

interface ConverterState {
  input: string;
  output?: {
    currency: string;
    value: number;
  };
}

const initialState: ConverterState = {
  input: "",
};

export const setInputField = createAsyncThunk(
  "converter/setInputField",
  (value: string, { getState }) => {
    const re = /(\d+(\.\d+)?)\s+([A-Za-z]+)\s+in\s+([A-Za-z]+)/;

    if (!re.test(value)) {
      return undefined;
    }

    const { currenciesMap } = (getState() as RootState).currencies;
    const matches = value.match(re)!;
    const valueIn = matches[1];
    const currIn = currenciesMap[matches[3].toUpperCase()];
    const currOut = currenciesMap[matches[4].toUpperCase()];

    if (currIn && currOut) {
      const converted = (+valueIn * currIn.value) / currOut.value;

      return {
        currency: currOut.charCode,
        value: converted,
      };
    } else {
      return undefined;
    }
  }
);

const converterSlice = createSlice({
  name: "converter",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setInputField.pending, (state, action) => {
      state.input = action.meta.arg;
      state.output = undefined;
    });
    builder.addCase(setInputField.fulfilled, (state, action) => {
      state.output = action.payload;
    });
  },
});

export default converterSlice.reducer;
