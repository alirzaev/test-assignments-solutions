import {CLOSE_MODAL_WINDOW, OPEN_MODAL_WINDOW} from "../actions/ModalWindowActions";

/**
 * @typedef {Object} ModalWindowState
 * @property {boolean} isOpened
 * @property {React.ReactNode?} element
 */

/**
 * @type {ModalWindowState}
 * @const
 */
const initialState = {
  isOpened: false,
  element: undefined,
};

/**
 * @param {ModalWindowState} state
 * @param {{type: string, payload: any}} action
 * @returns {ModalWindowState}
 */
export function modalWindowReducer(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    case OPEN_MODAL_WINDOW:
      return {
        ...state,
        isOpened: true,
        element: payload,
      };
    case CLOSE_MODAL_WINDOW:
      return {
        ...state,
        isOpened: false,
        element: undefined,
      };
    default:
      return state;
  }
}
