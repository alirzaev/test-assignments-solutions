export const SET_STOPS_COUNT = 'SET_STOP_COUNT';

export const SET_SORT_ORDER = 'SET_SORT_ORDER';

export function setStopsCount(stops) {
  return (dispatch, getState) => dispatch({
    type: SET_STOPS_COUNT,
    payload: {
      stops,
      rootState: getState()
    },
  });
}

export function setSortOrder(order) {
  return (dispatch, getState) => dispatch({
    type: SET_SORT_ORDER,
    payload: {
      order,
      rootState: getState()
    },
  });
}
