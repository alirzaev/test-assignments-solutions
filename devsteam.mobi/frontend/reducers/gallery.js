import Status from '../enum/Status';
import {FETCH_PHOTOS, FETCH_PHOTOS_SUCCESS} from '../actions/GalleryActions';

const initialState = {
  status: Status.IDLE,
  photos: [],
  pages: 1,
  nextPage: 1,
};

export function galleryReducer(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    case FETCH_PHOTOS:
      return {
        ...state,
        status: Status.FETCHING,
      };
    case FETCH_PHOTOS_SUCCESS:
      return {
        ...state,
        status: Status.SUCCESS,
        photos: [...state.photos, ...payload.photos],
        pages: payload.pages,
        nextPage: state.nextPage + 1,
      };
    default:
      return state;
  }
}
