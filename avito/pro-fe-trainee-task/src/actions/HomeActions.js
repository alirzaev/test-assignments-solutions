import axios from 'axios';

export const SEARCH_REPOS_REQUEST = 'SEARCH_REPOS_REQUEST';

export const SEARCH_REPOS_SUCCESS = 'SEARCH_REPOS_SUCCESS';

export const SEARCH_REPOS_FAILED = 'SEARCH_REPOS_FAILED';

export const UPDATE_SEARCH_FIELD = 'UPDATE_SEARCH_FIELD';

export function searchRepos(input, page, history, push = true) {
  return (dispatch) => {
    dispatch({
      type: SEARCH_REPOS_REQUEST,
      payload: {input, page}
    });

    if (push) {
      const search = new URLSearchParams([['q', input], ['p', page]]);
      const location = history.location;
      history.push(`${location.pathname}?${search.toString()}`);
    }

    let params;

    if (input !== '') {
      params = {
        q: input,
        sort: 'stars',
        order: 'desc',
        per_page: 10,
        page: page
      };
    } else {
      params = {
        q: 'stars:>=1',
        order: 'desc',
        per_page: 10,
        page: page
      };
    }

    axios.get('https://api.github.com/search/repositories', {params})
      .then((response) => {
        dispatch({
          type: SEARCH_REPOS_SUCCESS,
          payload: response.data
        });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: SEARCH_REPOS_FAILED,
            payload: error.response.data.message
          });
        } else {
          dispatch({
            type: SEARCH_REPOS_FAILED,
            payload: 'Unknown error'
          });
        }
      });
  };
}

export function updateSearchField(input) {
  return {
    type: UPDATE_SEARCH_FIELD,
    payload: input
  };
}
