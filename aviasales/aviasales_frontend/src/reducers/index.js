import {combineReducers} from 'redux';

import {filtersReducer} from './filters';
import {ticketsReducer} from './tickets';

export const rootReducer = combineReducers({
  filters: filtersReducer,
  tickets: ticketsReducer
});
