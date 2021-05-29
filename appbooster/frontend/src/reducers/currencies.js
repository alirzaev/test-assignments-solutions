import {OrderedMap} from 'immutable';

import Status from '../enum/Status';
import {
  FETCH_CURRENCIES_FAILED,
  FETCH_CURRENCIES_REQUEST,
  FETCH_CURRENCIES_SUCCESS, SET_BASE_CURRENCY
} from '../actions/CurrenciesActions';

const initialState = {
  currencies: OrderedMap(),
  baseCurrency: null,
  timestamp: null,
  status: Status.IDLE,
  error: null,
};

export function currenciesReducer(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
  case FETCH_CURRENCIES_REQUEST:
    return {
      ...state,
      currencies: OrderedMap(),
      baseCurrency: null,
      status: Status.FETCHING,
      error: null
    };
  case FETCH_CURRENCIES_SUCCESS:
    return {
      ...state,
      status: Status.SUCCESS,
      currencies: payload.currencies,
      timestamp: payload.timestamp,
      error: null
    };
  case FETCH_CURRENCIES_FAILED:
    return {
      ...state,
      status: Status.FAILED,
      error: payload
    };
  case SET_BASE_CURRENCY:
    return {
      ...state,
      baseCurrency: payload
    };
  default:
    return state;
  }
}
