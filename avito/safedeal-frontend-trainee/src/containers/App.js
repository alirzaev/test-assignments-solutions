import * as React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import ModalWindow from "./ModalWindow";
import {PhotoGallery} from "../components/PhotoGallery";
import {DetailedPhoto} from "../components/DetailedPhoto";
import {fetchPhotos} from "../actions/PhotoGalleryActions";
import {openModalWindow} from "../actions/ModalWindowActions";

import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.onPhotoClick = this.onPhotoClick.bind(this);
  }

  onPhotoClick(photoId) {
    const element = <DetailedPhoto id={photoId} />;

    this.props.openModalWindow(element);
  }

  componentDidMount() {
    this.props.fetchPhotos();
  }

  render() {
    const {photos, isFetching, error} = this.props;

    let content;

    if (isFetching) {
      content = (
        <div className="app-gallery-dummy">
          <p className="app-gallery-dummy__text">Загрузка...</p>
        </div>
      );
    } else if (error) {
      content = (
        <div className="app-gallery-error">
          <p className="app-gallery-error__text">Ошибка</p>
        </div>
      );
    } else {
      content = <PhotoGallery photos={photos} onPhotoClick={this.onPhotoClick} />;
    }

    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-header__title">Test app</h1>
        </header>
        <main className="app-main">
          <div className="container">{content}</div>
          <ModalWindow />
        </main>
        <footer className="app-footer">
          <div className="container">
            <hr className="app-footer__line" />
            <p className="app-footer__copyright">&copy; 2018-2022</p>
          </div>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  isFetching: store.photoGallery.isFetching,
  error: store.photoGallery.error,
  photos: store.photoGallery.photos,
});

const mapDispatchToProps = (dispatch) => ({
  fetchPhotos: () => dispatch(fetchPhotos()),
  openModalWindow: (element) => dispatch(openModalWindow(element)),
});

App.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string,
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
  fetchPhotos: PropTypes.func.isRequired,
  openModalWindow: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
