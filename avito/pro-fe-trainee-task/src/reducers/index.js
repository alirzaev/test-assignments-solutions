import { combineReducers } from 'redux';

import { homeReducer } from './home';
import { repositoryReducer } from './repository';

export const rootReducer = combineReducers({
  home: homeReducer,
  repository: repositoryReducer
});
