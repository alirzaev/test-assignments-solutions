import axios from 'axios';

export const FETCH_REPOSITORY_REQUEST = 'FETCH_REPOSITORY_REQUEST';

export const FETCH_REPOSITORY_SUCCESS = 'FETCH_REPOSITORY_SUCCESS';

export const FETCH_REPOSITORY_FAILED = 'FETCH_REPOSITORY_FAILED';

export function fetchRepository(fullName) {
  return (dispatch) => {
    dispatch({
      type: FETCH_REPOSITORY_REQUEST
    });

    Promise.all([
      axios.get(`https://api.github.com/repos/${fullName}`),
      axios.get(`https://api.github.com/repos/${fullName}/languages`),
      axios.get(`https://api.github.com/repos/${fullName}/contributors`, {params: {per_page: 10}}),
    ])
      .then(([repo, languages, contributors]) => {
        dispatch({
          type: FETCH_REPOSITORY_SUCCESS,
          payload: {
            ...repo.data,
            languages: languages.data,
            contributors: contributors.data
          }
        });
      })
      .catch((error) => {
        if (error.response) {
          dispatch({
            type: FETCH_REPOSITORY_FAILED,
            payload: error.response.data.message
          });
        } else {
          dispatch({
            type: FETCH_REPOSITORY_FAILED,
            payload: 'Unknown error'
          });
        }
      });
  };
}