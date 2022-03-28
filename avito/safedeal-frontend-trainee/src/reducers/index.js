import {combineReducers} from "redux";

import {photoGalleryReducer} from "./photoGallery";
import {modalWindowReducer} from "./modalWindow";

export const rootReducer = combineReducers({
  photoGallery: photoGalleryReducer,
  modalWindow: modalWindowReducer,
});
