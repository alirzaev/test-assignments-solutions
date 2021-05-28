import {
  FETCH_TICKETS_REQUEST,
  FETCH_TICKETS_FINISHED,
  SHOW_MORE_TICKETS,
  SET_STOPS_COUNT,
  SET_SORT_ORDER
} from '../actions';
import SortOrder from '../enum/SortOrder';


const initialState = {
  tickets: [],
  filtered: [],
  isFetching: false,
  shown: 0,
};

function filter(tickets, stops, order) {
  const set = new Set(stops);

  return tickets.filter(({segments}) =>
    set.size === 0 ||
    (set.has(segments[0].stops.length) &&
      set.has(segments[1].stops.length))
  ).sort((a, b) => {
    if (order === SortOrder.CHEAPEST) {
      return a.price - b.price;
    }

    return (a.segments[0].duration + a.segments[1].duration) -
      (b.segments[0].duration + b.segments[1].duration);
  });
}

export function ticketsReducer(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
  case FETCH_TICKETS_REQUEST:
    return {
      ...state,
      tickets: [],
      filtered: [],
      isFetching: true,
      shown: 0
    };
  case FETCH_TICKETS_FINISHED: {
    const {tickets, rootState} = payload;
    const {stops, order} = rootState.filters;

    const filtered = filter(tickets, stops, order);

    return {
      ...state,
      tickets: payload.tickets,
      filtered: filtered,
      isFetching: false,
      shown: Math.min(filtered.length, 5)
    };
  }
  case SHOW_MORE_TICKETS:
    return {
      ...state,
      shown: Math.min(state.shown + 5, state.filtered.length)
    };
  case SET_SORT_ORDER:
  case SET_STOPS_COUNT: {
    const {tickets} = state;
    let {stops, order} = payload.rootState.filters;

    if (type === SET_STOPS_COUNT) {
      stops = payload.stops;
    } else if (type === SET_SORT_ORDER) {
      order = payload.order;
    }

    const filtered = filter(tickets, stops, order);

    return {
      ...state,
      filtered,
      shown: Math.min(filtered.length, 5)
    };
  }
  default:
    return state;
  }
}
