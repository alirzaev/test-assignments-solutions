export const SET_CONVERTER_STATE = 'SET_CONVERTER_STATE';

/**
 * @param {string} input
 * @param {string | null} currency
 * @param {number | null} value
 */
export function setConverterState(input, currency, value) {
  return {
    type: SET_CONVERTER_STATE,
    payload: {
      input,
      currency,
      value
    }
  };
}

/**
 * @param {string} value
 */
export function setInputField(value) {
  return (dispatch, getState) => {
    const re = /(\d+(\.\d+)?)\s+([A-Za-z]+)\s+in\s+([A-Za-z]+)/;

    if (re.test(value)) {
      const {currencies} = getState().currencies;
      const matches = value.match(re);
      const valueIn = matches[1];
      const currIn = currencies.get(matches[3].toUpperCase());
      const currOut = currencies.get(matches[4].toUpperCase());

      if (currIn && currOut) {
        const converted = valueIn * currIn.value / currOut.value;

        dispatch(setConverterState(value, currOut.charCode, converted));
      } else {
        dispatch(setConverterState(value, null, null));
      }
    } else {
      dispatch(setConverterState(value, null, null));
    }
  };
}