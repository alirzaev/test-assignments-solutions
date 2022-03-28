import * as React from "react";
import {useCallback} from "react";
import {useSelector, useDispatch} from "react-redux";

import {closeModalWindow} from "../actions/ModalWindowActions";

import "./ModalWindow.css";

export default function ModalWindow() {
  const isOpened = useSelector((state) => state.modalWindow.isOpened);
  const element = useSelector((state) => state.modalWindow.element);
  const dispatch = useDispatch();

  const onClick = useCallback(() => {
    dispatch(closeModalWindow());
  }, [dispatch]);

  if (!isOpened) {
    return <React.Fragment />;
  }

  return (
    <div className="modal-container">
      <div className="modal-container__window">
        <div className="modal-container__close-button-wrapper">
          <div className="modal-container__close-button" onClick={onClick} />
        </div>
        <div className="modal-container__content">{element}</div>
      </div>
    </div>
  );
}
