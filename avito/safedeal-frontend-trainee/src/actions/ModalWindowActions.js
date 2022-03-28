export const OPEN_MODAL_WINDOW = "OPEN_MODAL_WINDOW";

export const CLOSE_MODAL_WINDOW = "CLOSE_MODAL_WINDOW";

/**
 * @param {React.ReactNode} element a React element to show in the modal window
 * @returns thunk action
 */
export function openModalWindow(element) {
  return (dispatch) => {
    // save the vertical scroll position
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.position = "fixed";

    dispatch({
      type: OPEN_MODAL_WINDOW,
      payload: element,
    });
  };
}

/**
 * @returns thunk action
 */
export function closeModalWindow() {
  return (dispatch) => {
    dispatch({
      type: CLOSE_MODAL_WINDOW,
    });

    const scrollY = document.body.style.top;
    document.body.style.top = "";
    document.body.style.width = "";
    document.body.style.position = "";
    // restore the vertical scroll position
    window.scrollTo(0, parseInt(scrollY || "0") * -1);
  };
}
