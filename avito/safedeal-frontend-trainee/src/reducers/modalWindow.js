import {Map} from 'immutable';
import {
  CLOSE_MODAL_WINDOW,
  FETCH_PHOTO_INFO_FAILED,
  FETCH_PHOTO_INFO_REQUEST,
  FETCH_PHOTO_INFO_SUCCESS,
  OPEN_MODAL_WINDOW,
  SEND_COMMENT_FAILED,
  SEND_COMMENT_REQUEST,
  SEND_COMMENT_SUCCESS,
  UPDATE_COMMENT_FORM
} from '../actions/ModalWindowActions';

const initialState = Map({
  isOpened: false,
  isFetching: false,
  error: '',
  photo: '',
  comments: [],
  form: Map({
    name: '',
    comment: '',
    isPending: false
  })
});

export function modalWindowReducer(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
  case OPEN_MODAL_WINDOW:
    return state.set('isOpened', true);
  case CLOSE_MODAL_WINDOW:
    return state.set('isOpened', false).set('error', '').set('photo', '').set('comments', []);
  case FETCH_PHOTO_INFO_REQUEST:
    return state.set('isFetching', true);
  case FETCH_PHOTO_INFO_SUCCESS:
    return state.set('isFetching', false).set('photo', payload.url).set('comments', payload.comments);
  case FETCH_PHOTO_INFO_FAILED:
    return state.set('isFetching', false).set('error', payload);
  case UPDATE_COMMENT_FORM:
    return state.setIn(['form', payload.field], payload.value);
  case SEND_COMMENT_REQUEST:
    return state.setIn(['form', 'isPending'], true);
  case SEND_COMMENT_SUCCESS:
    return state.setIn(['form', 'isPending'], false).setIn(['form', 'name'], '').setIn(['form', 'comment'], '');
  case SEND_COMMENT_FAILED:
    return state.setIn(['form', 'isPending'], false);
  default:
    return state;
  }
}
