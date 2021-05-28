import {SET_SORT_ORDER, SET_STOPS_COUNT} from '../actions';
import SortOrder from '../enum/SortOrder';

const initialState = {
  order: SortOrder.CHEAPEST,
  stops: [0, 1, 2, 3],
};

export function filtersReducer(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
  case SET_STOPS_COUNT:
    return {
      ...state,
      stops: Array.from(payload.stops.values())
    };
  case SET_SORT_ORDER:
    return {
      ...state,
      order: payload.order
    };
  default:
    return state;
  }
}
