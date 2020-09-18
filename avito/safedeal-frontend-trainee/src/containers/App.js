import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import './App.css';
import {PhotoGallery} from '../components/PhotoGallery';
import {fetchPhotos} from '../actions/PhotoGalleryActions';
import ModalWindow from './ModalWindow';
import {openModalWindow} from '../actions/ModalWindowActions';

class App extends React.Component {
  onPhotoClicked(photoId) {
    this.props.openModalWindowAction(photoId);
  }

  componentDidMount() {
    this.props.fetchPhotosAction();
  }

  render() {
    const {photos, isFetching, error} = this.props.photoGallery;

    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-header__title">Test app</h1>
        </header>
        <main className="app-main">
          <div className="container">
            <PhotoGallery photos={photos} isFetching={isFetching} error={error}
              onPhotoClicked={(id) => this.onPhotoClicked(id)}/>
            <ModalWindow/>
          </div>
        </main>
        <footer className="app-footer">
          <div className="container">
            <hr className="app-footer__line"/>
            <p className="app-footer__copyright">&copy; 2018-2020</p>
          </div>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  photoGallery: store.photoGallery.toObject()
});

const mapDispatchToProps = (dispatch) => ({
  fetchPhotosAction: () => dispatch(fetchPhotos()),
  openModalWindowAction: (photoId) => dispatch(openModalWindow(photoId))
});

App.propTypes = {
  photoGallery: PropTypes.object.isRequired,
  fetchPhotosAction: PropTypes.func.isRequired,
  openModalWindowAction: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
