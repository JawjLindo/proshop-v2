import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUserModel {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export interface IUser extends IUserModel, Document {}

interface IUserMethods {
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

interface UserModel extends Model<IUserModel, {}, IUserMethods> {}

const UserSchema = new Schema<IUserModel, UserModel, IUserMethods>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

UserSchema.methods.matchPassword = async function matchPassword(
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = mongoose.model<IUserModel, UserModel>('User', UserSchema);
