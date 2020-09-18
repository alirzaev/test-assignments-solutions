import axios from 'axios';

export const FETCH_PHOTOS_REQUEST = 'FETCH_PHOTOS_REQUEST';

export const FETCH_PHOTOS_SUCCESS = 'FETCH_PHOTOS_SUCCESS';

export const FETCH_PHOTOS_FAILED = 'FETCH_PHOTOS_FAILED';

export function fetchPhotos() {
  return dispatch => {
    dispatch({
      type: FETCH_PHOTOS_REQUEST
    });

    axios.get('https://boiling-refuge-66454.herokuapp.com/images')
      .then(response => {
        dispatch({
          type: FETCH_PHOTOS_SUCCESS,
          payload: response.data
        });
      })
      .catch(() => {
        dispatch({
          type: FETCH_PHOTOS_FAILED,
          payload: 'FAILED'
        });
      });
  };
}