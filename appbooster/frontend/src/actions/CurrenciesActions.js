import axios from 'axios';
import {OrderedMap} from 'immutable';

const API_URL = 'https://www.cbr-xml-daily.ru/daily_json.js';

export const FETCH_CURRENCIES_REQUEST = 'FETCH_CURRENCIES_REQUEST';

export const FETCH_CURRENCIES_SUCCESS = 'FETCH_CURRENCIES_SUCCESS';

export const FETCH_CURRENCIES_FAILED = 'FETCH_CURRENCIES_FAILED';

export const SET_BASE_CURRENCY = 'SET_BASE_CURRENCY';

/**
 * @param {Array<Object>} currencies
 * @param {string} currencies[].charCode
 * @param {string} currencies[].name
 * @param {number} currencies[].nominal
 * @param {number} currencies[].value
 * @param {string} timestamp
 */
export function fetchCurrenciesSuccess(currencies, timestamp) {
  const map = OrderedMap([{
    'charCode': 'RUB',
    'nominal': 1,
    'name': 'Российский рубль',
    'value': 1
  }, ...currencies]
    .sort((a, b) => a.charCode.localeCompare(b.charCode))
    .map((currency) => [currency.charCode, currency]));

  return {
    type: FETCH_CURRENCIES_SUCCESS,
    payload: {
      currencies: map,
      timestamp,
    }
  };
}

/**
 * @param {Object | string | null} error
 */
export function fetchCurrenciesFailed(error = null) {
  return {
    type: FETCH_CURRENCIES_FAILED,
    payload: error
  };
}

export function fetchCurrencies() {
  return (dispatch) => {
    dispatch({
      type: FETCH_CURRENCIES_REQUEST
    });

    axios.get(API_URL).then((response) => {
      const {Valute, Timestamp: timestamp} = response.data;

      const currencies =
        Object.values(Valute).map(({CharCode, Nominal, Name, Value}) => ({
          charCode: CharCode,
          nominal: Nominal,
          name: Name,
          value: Value
        }));

      dispatch(fetchCurrenciesSuccess(currencies, timestamp));
    }).catch((error) => {
      if (error.response) {
        dispatch(fetchCurrenciesFailed(error.response));
      } else {
        dispatch(fetchCurrenciesFailed());
      }
    });
  };
}

/**
 * @param {string} currencyCharCode
 */
export function setBaseCurrency(currencyCharCode) {
  return {
    type: SET_BASE_CURRENCY,
    payload: currencyCharCode
  };
}
