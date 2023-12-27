import { BASE_IMAGE_URL } from './constants';

export const formatImageUrl: (image: string | undefined) => string = (
  image
) => {
  return `${BASE_IMAGE_URL}${image}`;
};
