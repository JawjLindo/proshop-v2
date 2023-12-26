import mongoose, { Schema, Document } from 'mongoose';

import { ReviewSchema, IReview } from './review.model';
import { IUser } from './user.model';

interface IProductModel {
  user: IUser;
  reviews?: IReview[];
  name: string;
  image: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
}

export interface IProduct extends IProductModel, Document {}

const ProductSchema = new Schema<IProductModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    reviews: [ReviewSchema],
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model<IProductModel>('Product', ProductSchema);
