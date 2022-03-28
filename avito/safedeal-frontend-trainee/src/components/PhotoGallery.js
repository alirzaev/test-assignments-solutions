import * as React from "react";
import PropTypes from "prop-types";

import "./PhotoGallery.css";

export function PhotoGallery({photos, onPhotoClick}) {
  return (
    <div className="gallery">
      {photos.map(({id, url}) => (
        <div key={id} className="gallery__photo-container">
          <img src={url} alt="" className="gallery__photo" onClick={() => onPhotoClick(id)} />
        </div>
      ))}
    </div>
  );
}

PhotoGallery.propTypes = {
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
  onPhotoClick: PropTypes.func.isRequired,
};
