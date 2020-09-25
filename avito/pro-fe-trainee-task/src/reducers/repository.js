import { Map } from 'immutable';
import {
  FETCH_REPOSITORY_REQUEST,
  FETCH_REPOSITORY_SUCCESS,
  FETCH_REPOSITORY_FAILED
} from '../actions/RepositoryActions';

const initialState = Map({
  isFetching: true,
  repo: {},
  error: ''
});

export function repositoryReducer(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
  case FETCH_REPOSITORY_REQUEST:
    return state.set('isFetching', true);
  case FETCH_REPOSITORY_SUCCESS:
    return state.set('isFetching', false).set('repo', payload);
  case FETCH_REPOSITORY_FAILED:
    return state.set('isFetching', false).set('repo', {}).set('error', payload);
  default:
    return state;
  }
}
