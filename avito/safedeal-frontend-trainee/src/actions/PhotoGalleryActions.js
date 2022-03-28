import api from "../utils/api";

export const FETCH_PHOTOS_REQUEST = "FETCH_PHOTOS_REQUEST";

export const FETCH_PHOTOS_SUCCESS = "FETCH_PHOTOS_SUCCESS";

export const FETCH_PHOTOS_FAILED = "FETCH_PHOTOS_FAILED";

/**
 * @returns thunk action
 */
export function fetchPhotos() {
  return (dispatch) => {
    dispatch({
      type: FETCH_PHOTOS_REQUEST,
    });

    api
      .fetchPhotos()
      .then((photos) => {
        dispatch({
          type: FETCH_PHOTOS_SUCCESS,
          payload: photos,
        });
      })
      .catch(() => {
        dispatch({
          type: FETCH_PHOTOS_FAILED,
          payload: "FAILED",
        });
      });
  };
}
