import axios from "axios";

const API_URL = "https://boiling-refuge-66454.herokuapp.com";

/**
 * @typedef {Object} Photo
 * @property {number} id
 * @property {string} url
 */

/**
 * Get a list of photos
 * @return {Promise<Photo[]>}
 */
export function fetchPhotos() {
  return axios.get(`${API_URL}/images`).then((response) => response.data);
}

/**
 * @typedef {Object} PhotoComment
 * @property {number} id
 * @property {string} text
 * @property {string} date
 *
 * @typedef {Object} PhotoDetails
 * @property {string} url
 * @property {PhotoComment[]} comments
 */

/**
 * Get detailed information about the photo
 * @param {number} photoId photo ID
 * @returns {Promise<PhotoDetails>}
 */
export function fetchPhotoDetails(photoId) {
  return axios.get(`${API_URL}/images/${photoId}`).then((response) => response.data);
}

/**
 * Add a comment
 * @param {number} photoId photo ID
 * @param {string} name user name
 * @param {string} comment comment
 * @returns {Promise<void>}
 */
export function addCommentToPhoto(photoId, name, comment) {
  return axios
    .post(`${API_URL}/images/${photoId}/comments`, {
      name,
      comment,
    })
    .then((response) => response.data);
}

export default {
  fetchPhotos,
  fetchPhotoDetails,
  addCommentToPhoto,
};
