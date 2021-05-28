import axios from 'axios';

const API_URL = 'https://front-test.beta.aviasales.ru';

export const FETCH_TICKETS_REQUEST = 'FETCH_TICKETS_REQUEST';

export const FETCH_TICKETS_FINISHED = 'FETCH_TICKETS_FINISHED';

export const SHOW_MORE_TICKETS = 'SHOW_MORE_TICKETS';

export function fetchTickets() {
  return async (dispatch, getState) => {
    dispatch({
      type: FETCH_TICKETS_REQUEST,
    });

    const { searchId } = (await axios.get(`${API_URL}/search`)).data;
    const tickets = [];

    for (;;) {
      try {
        const { tickets: chunk, stop } = (await axios.get(`${API_URL}/tickets`, {
          params: {
            searchId,
          },
        })).data;

        tickets.push(...chunk);

        if (stop) {
          break;
        }
      } catch (e) {
        console.log(e);
      }
    }

    dispatch({
      type: FETCH_TICKETS_FINISHED,
      payload: {
        tickets,
        rootState: getState()
      },
    });
  };
}

export function showMoreTickets() {
  return {
    type: SHOW_MORE_TICKETS,
  };
}
