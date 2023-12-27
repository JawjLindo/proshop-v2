const BASE_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '';
export const BASE_API_URL = `${BASE_URL}/api`;
export const BASE_IMAGE_URL = `${BASE_URL}/images/`;
