import axios from 'axios';

const API_URL = 'https://api.unsplash.com';

const PER_PAGE = 24;

export const FETCH_PHOTOS = 'FETCH_PHOTOS';

export const FETCH_PHOTOS_SUCCESS = 'FETCH_PHOTOS_SUCCESS';

export function fetchPhotosSuccess(photos, pages) {
  return {
    type: FETCH_PHOTOS_SUCCESS,
    payload: {photos, pages},
  };
}

export function fetchPhotos() {
  return (dispatch, getState) => {
    const {gallery} = getState();
    const {pages, nextPage} = gallery;

    if (nextPage > pages) {
      return;
    }

    dispatch({
      type: FETCH_PHOTOS,
    });

    axios
      .get(`${API_URL}/photos`, {
        params: {
          page: nextPage,
          per_page: PER_PAGE,
          client_id:
            'cf49c08b444ff4cb9e4d126b7e9f7513ba1ee58de7906e4360afc1a33d1bf4c0',
        },
      })
      .then(response => {
        const photos = response.data;
        const totalPages = Math.ceil(+response.headers['x-total'] / PER_PAGE);

        dispatch(fetchPhotosSuccess(photos, totalPages));
      })
      .catch(() => {});
  };
}
