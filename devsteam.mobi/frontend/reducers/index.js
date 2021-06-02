import {combineReducers} from 'redux';
import {galleryReducer} from './gallery';

export const rootReducer = combineReducers({
  gallery: galleryReducer,
});
