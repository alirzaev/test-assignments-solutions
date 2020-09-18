import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import './ModalWindow.css';
import {closeModalWindow, sendComment, updateCommentForm} from '../actions/ModalWindowActions';

class ModalWindow extends React.Component {
  closeWindow() {
    this.props.closeModalWindowAction();
  }

  renderComment(comment) {
    const {id, text} = comment;
    const date = new Date(comment.date);

    return (
      <li className="modal-container__comments-item" key={id}>
        <time className="modal-container__comments-date"
          dateTime={date.toISOString()}>{date.toLocaleDateString()}</time>
        <p className="modal-container__comments-content">{text}</p>
      </li>
    );
  }

  handleChange(e, field) {
    const value = e.target.value;

    this.props.updateCommentFormAction(field, value);
  }

  handleSubmit(e) {
    e.preventDefault();
    const {form} = this.props.modalWindow;

    this.props.sendCommentAction(237, form.get('name'), form.get('comment'));
  }

  render() {
    const {isOpened, photo, comments, form} = this.props.modalWindow;
    const isPending = form.get('isPending');

    if (!isOpened) {
      return <React.Fragment/>;
    }

    return (
      <div className="modal-container">
        <div className="modal-container__window">
          <div className="modal-container__close-button-wrapper">
            <div className="modal-container__close-button" onClick={() => this.closeWindow()}/>
          </div>
          <div className="modal-container__layout">
            <div className="modal-container__photo-wrapper">
              <img src={photo} alt="" className="modal-container__photo"/>
            </div>
            <div className="modal-container__comments">
              <ul className="modal-container__comments-list">
                {comments.map((comment) => this.renderComment(comment))}
              </ul>
            </div>
            <div className="modal-container__form">
              <form className="modal-container__form-layout" onSubmit={(e) => this.handleSubmit(e)}>
                <input type="text" className="modal-container__form-field" placeholder="Ваше имя"
                  value={form.get('name')} onChange={(e) => this.handleChange(e, 'name')} 
                  disabled={isPending} required/>
                <input type="text" className="modal-container__form-field" placeholder="Ваш комментарий"
                  value={form.get('comment')} onChange={(e) => this.handleChange(e, 'comment')}
                  disabled={isPending} required/>
                <button type="submit" className="modal-container__form-button"
                  disabled={isPending}>Оставить комментарий</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  modalWindow: state.modalWindow.toObject()
});

const mapDispatchToProps = (dispatch) => ({
  closeModalWindowAction: () => dispatch(closeModalWindow()),
  sendCommentAction: (photoId, name, comment) => dispatch(sendComment(photoId, name, comment)),
  updateCommentFormAction: (field, value) => dispatch(updateCommentForm(field, value))
});

ModalWindow.propTypes = {
  modalWindow: PropTypes.object.isRequired,
  closeModalWindowAction: PropTypes.func.isRequired,
  sendCommentAction: PropTypes.func.isRequired,
  updateCommentFormAction: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalWindow);

