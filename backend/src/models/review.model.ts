import { Document, Schema } from 'mongoose';
import { IUser } from './user.model';

interface IReviewModel {
  name: string;
  rating: number;
  comment: string;
  user: IUser;
}

export interface IReview extends IReviewModel, Document {}

export const ReviewSchema = new Schema<IReviewModel>(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true }
);
