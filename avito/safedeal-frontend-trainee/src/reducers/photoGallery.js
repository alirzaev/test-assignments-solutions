import {Map} from 'immutable';
import { FETCH_PHOTOS_REQUEST, FETCH_PHOTOS_SUCCESS, FETCH_PHOTOS_FAILED } from '../actions/PhotoGalleryActions';

const initialState = Map({
  photos: [],
  isFetching: false,
  error: ''
});

export function photoGalleryReducer(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
  case FETCH_PHOTOS_REQUEST:
    return state.set('isFetching', true);
  case FETCH_PHOTOS_SUCCESS:
    return state.set('isFetching', false).set('photos', payload);
  case FETCH_PHOTOS_FAILED:
    return state.set('isFetching', false).set('error', payload);
  default:
    break;
  }

  return state;
}