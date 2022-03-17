import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Status } from "../../utils/enums";
import { getDailyCurrencies } from "../../utils/api";
import { DEFAULT_CURRENCY } from "../../utils/consts";

export interface Currency {
  charCode: string;
  name: string;
  nominal: number;
  value: number;
}

interface CurrenciesState {
  currenciesList: Currency[];
  currenciesMap: { [s: string]: Currency };
  baseCurrency: string | null;
  timestamp: string | null;
  status: Status;
  error: any;
}

const initialState: CurrenciesState = {
  currenciesList: [],
  currenciesMap: {},
  baseCurrency: null,
  timestamp: null,
  status: Status.IDLE,
  error: null,
};

export const fetchCurrencies = createAsyncThunk<[Currency[], string], void>(
  "currencies/fetchCurrencies",
  async (_, { rejectWithValue }) => {
    try {
      const { Valute, Timestamp } = await getDailyCurrencies();

      const currencies: Currency[] = Object.values(Valute).map(
        ({ CharCode, Nominal, Name, Value }) => ({
          charCode: CharCode,
          nominal: Nominal,
          name: Name,
          value: Value,
        })
      );

      return [currencies, Timestamp];
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response);
      } else {
        return rejectWithValue(true);
      }
    }
  }
);

const currenciesSlice = createSlice({
  name: "currencies",
  initialState,
  reducers: {
    setBaseCurrency: (
      state: CurrenciesState,
      action: PayloadAction<string>
    ) => {
      state.baseCurrency = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrencies.pending, (state) => {
      state.currenciesList = [];
      state.currenciesMap = {};
      state.baseCurrency = null;
      state.status = Status.FETCHING;
      state.error = null;
    });
    builder.addCase(fetchCurrencies.fulfilled, (state, action) => {
      const [currencies, timestamp] = action.payload;

      state.status = Status.SUCCESS;
      state.currenciesList = [DEFAULT_CURRENCY, ...currencies].sort((a, b) =>
        a.charCode.localeCompare(b.charCode)
      );

      state.currenciesMap = {};
      state.currenciesList.forEach((currency) => {
        state.currenciesMap[currency.charCode] = currency;
      });

      state.timestamp = timestamp;
    });
    builder.addCase(fetchCurrencies.rejected, (state, action) => {
      state.status = Status.FAILED;
      state.error = action.payload;
    });
  },
});

export const { setBaseCurrency } = currenciesSlice.actions;

export default currenciesSlice.reducer;
