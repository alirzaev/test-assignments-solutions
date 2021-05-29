import {combineReducers} from 'redux';

import {currenciesReducer} from './currencies';
import {converterReducer} from './converter';

export const rootReducer = combineReducers({
  converter: converterReducer,
  currencies: currenciesReducer
});
