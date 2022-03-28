import * as React from "react";
import PropTypes from "prop-types";

import api from "../utils/api";

import "./DetailedPhoto.css";

export class DetailedPhoto extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      photo: undefined,
      name: "",
      text: "",
      isPending: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  fetchPhotoDetails(photoId) {
    api.fetchPhotoDetails(photoId).then((photo) =>
      this.setState({
        photo,
      })
    );
  }

  onSubmit(event) {
    event.preventDefault();

    this.setState({
      isPending: true,
    });

    api
      .addCommentToPhoto(this.props.id, this.state.name, this.state.text)
      .then(() =>
        this.setState({
          isPending: false,
          name: "",
          text: "",
        })
      )
      .catch(() =>
        this.setState({
          isPending: false,
        })
      );
  }

  setName(name) {
    this.setState({
      name,
    });
  }

  setText(text) {
    this.setState({
      text,
    });
  }

  componentDidMount() {
    this.fetchPhotoDetails(this.props.id);
  }

  componentDidUpdate() {
    this.fetchPhotoDetails(this.props.id);
  }

  renderComment(id, text, dateStr) {
    const date = new Date(dateStr);

    return (
      <li className="modal-container__comments-item" key={id}>
        <time className="modal-container__comments-date" dateTime={date.toISOString()}>
          {date.toLocaleDateString()}
        </time>
        <p className="modal-container__comments-content">{text}</p>
      </li>
    );
  }

  render() {
    const {photo, name, text, isPending} = this.state;

    const hasComments = (photo?.comments?.length ?? 0) > 0;

    return (
      <div className="detailed-photo">
        <div className="detailed-photo__photo-wrapper">
          <img src={photo?.url} alt="" className="detailed-photo__photo" />
        </div>
        <div className="detailed-photo__comments">
          {hasComments ? (
            <ul className="detailed-photo__comments-list">
              {photo?.comments.map(({id, text, date}) => this.renderComment(id, text, date))}
            </ul>
          ) : (
            <div className="detailed-photo__comments-empty">
              <p className="detailed-photo__comments-empty-text">Комментариев нет</p>
            </div>
          )}
        </div>
        <div className="detailed-photo__form">
          <form className="detailed-photo__form-layout" onSubmit={this.onSubmit}>
            <input
              type="text"
              className="detailed-photo__form-field"
              placeholder="Ваше имя"
              value={name}
              onChange={({target}) => this.setName(target.value)}
              disabled={isPending}
              required
            />
            <input
              type="text"
              className="detailed-photo__form-field"
              placeholder="Ваш комментарий"
              value={text}
              onChange={({target}) => this.setText(target.value)}
              disabled={isPending}
              required
            />
            <button type="submit" className="detailed-photo__form-button" disabled={isPending}>
              Оставить комментарий
            </button>
          </form>
        </div>
      </div>
    );
  }
}

DetailedPhoto.propTypes = {
  id: PropTypes.number.isRequired,
};
