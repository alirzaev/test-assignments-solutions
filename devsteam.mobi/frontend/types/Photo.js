/**
 * @format
 * @flow strict-local
 */
// eslint-disable-next-line no-unused-vars
type Photo = {
  id: string,
  description: string,
  alt_description: string,
  urls: {
    raw: string,
    full: string,
    regular: string,
    small: string,
    thumb: string,
  },
  user: {
    id: string,
    username: string,
  },
};
