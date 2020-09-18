import axios from 'axios';

export const OPEN_MODAL_WINDOW = 'OPEN_MODAL_WINDOW';

export const CLOSE_MODAL_WINDOW = 'CLOSE_MODAL_WINDOW';

export const FETCH_PHOTO_INFO_REQUEST = 'FETCH_PHOTO_INFO_REQUEST';

export const FETCH_PHOTO_INFO_SUCCESS = 'FETCH_PHOTO_INFO_SUCCESS';

export const FETCH_PHOTO_INFO_FAILED = 'FETCH_PHOTO_INFO_FAILED';

export const UPDATE_COMMENT_FORM = 'UPDATE_COMMENT_FORM';

export const SEND_COMMENT_REQUEST = 'SEND_COMMENT_REQUEST';

export const SEND_COMMENT_SUCCESS = 'SEND_COMMENT_SUCCESS';

export const SEND_COMMENT_FAILED = 'SEND_COMMENT_FAILED';

export function openModalWindow(photoId) {
  return (dispatch) => {
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.position = 'fixed';

    dispatch({
      type: OPEN_MODAL_WINDOW
    });

    dispatch(fetchPhotoInfo(photoId));
  };
}

export function closeModalWindow() {
  return (dispatch) => {
    dispatch({
      type: CLOSE_MODAL_WINDOW
    });

    const scrollY = document.body.style.top;
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.position = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  };
}

export function fetchPhotoInfo(photoId) {
  return (dispatch) => {
    dispatch({
      type: FETCH_PHOTO_INFO_REQUEST,
      payload: photoId
    });

    axios.get(`https://boiling-refuge-66454.herokuapp.com/images/${photoId}`)
      .then(response => {
        dispatch({
          type: FETCH_PHOTO_INFO_SUCCESS,
          payload: response.data
        });
      })
      .catch(() => {
        dispatch({
          type: FETCH_PHOTO_INFO_FAILED,
          payload: 'FAILED'
        });
      });
  };
}

export function updateCommentForm(field, value) {
  return {
    type: UPDATE_COMMENT_FORM,
    payload: {
      field, value
    }
  };
}

export function sendComment(photoId, name, comment) {
  return (dispatch) => {
    dispatch({
      type: SEND_COMMENT_REQUEST,
      payload: {
        photoId, name, comment
      }
    });

    axios.post(`https://boiling-refuge-66454.herokuapp.com/images/${photoId}/comments`, {
      name, comment
    })
      .then(() => {
        dispatch({
          type: SEND_COMMENT_SUCCESS
        });
      })
      .catch(() => {
        dispatch({
          type: SEND_COMMENT_FAILED,
          payload: 'FAILED'
        });
      });
  };
}