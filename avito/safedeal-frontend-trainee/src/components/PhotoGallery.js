import React from 'react';
import PropTypes from 'prop-types';

import './PhotoGallery.css';

export class PhotoGallery extends React.Component {
  onPhotoClicked(id) {
    this.props.onPhotoClicked(id);
  }

  render() {
    const {photos, isFetching} = this.props;
    if (isFetching) {
      return (
        <div className="gallery-dummy">
          <p className="gallery-dummy__text">Fetching...</p>
        </div>
      );
    } else {
      return (
        <div className="gallery">
          {photos.map(({id, url}) => (
            <div key={id} className="gallery__photo-container">
              <img src={url} alt="" className="gallery__photo" onClick={() => this.onPhotoClicked(id)}/>
            </div>
          ))}
        </div>
      );
    }
  }
}

PhotoGallery.propTypes = {
  photos: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  onPhotoClicked: PropTypes.func.isRequired
};
