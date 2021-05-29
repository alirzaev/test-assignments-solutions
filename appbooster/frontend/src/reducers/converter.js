import {SET_CONVERTER_STATE} from '../actions/ConverterActions';

const initialState = {
  input: '',
  currency: null,
  value: null
};

export function converterReducer(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
  case SET_CONVERTER_STATE:
    return {
      ...state,
      ...payload
    };
  default:
    return state;
  }
}
