import { Map } from 'immutable';
import {
  SEARCH_REPOS_FAILED,
  SEARCH_REPOS_REQUEST,
  SEARCH_REPOS_SUCCESS,
  UPDATE_SEARCH_FIELD
} from '../actions/HomeActions';

const initialState = Map({
  isFetching: false,
  repos: {},
  error: '',
  input: '',
  page: 1
});

export function homeReducer(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
  case SEARCH_REPOS_REQUEST:
    return state.set('isFetching', true).set('input', payload.input).set('page', payload.page);
  case SEARCH_REPOS_SUCCESS:
    return state.set('isFetching', false).set('repos', payload);
  case SEARCH_REPOS_FAILED:
    return state.set('isFetching', false).set('repos', {}).set('error', payload);
  case UPDATE_SEARCH_FIELD:
    return state.set('input', payload);
  default:
    return state;
  }
}
