import {FETCH_PHOTOS_REQUEST, FETCH_PHOTOS_SUCCESS, FETCH_PHOTOS_FAILED} from "../actions/PhotoGalleryActions";

/**
 * @typedef {Object} PhotoGalleryState
 * @property {Photo[]} photos see "../utils/api.js"
 * @property {boolean} isFetching
 * @property {string} error
 */

/**
 * @type {PhotoGalleryState}
 * @const
 */
const initialState = {
  photos: [],
  isFetching: false,
  error: "",
};

/**
 * @param {PhotoGalleryState} state
 * @param {{type: string, payload: any}} action
 * @returns {PhotoGalleryState}
 */
export function photoGalleryReducer(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    case FETCH_PHOTOS_REQUEST:
      return {
        ...state,
        isFetching: true,
        error: "",
      };
    case FETCH_PHOTOS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        photos: payload,
      };
    case FETCH_PHOTOS_FAILED:
      return {
        ...state,
        isFetching: false,
        error: payload,
      };
    default:
      return state;
  }
}
