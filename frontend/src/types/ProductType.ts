import { UserType } from './UserType';

export type ReviewType = {
  name: string;
  rating: number;
  comment: string;
  user?: UserType;
  createdAt?: Date;
};

export type ProductType = {
  _id: string;
  name: string;
  image: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  countInStock: number;
  rating?: number;
  numReviews?: number;
  reviews?: ReviewType[];
};
