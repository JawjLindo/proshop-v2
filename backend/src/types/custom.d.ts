import { Models } from '../models';

declare global {
  namespace Express {
    export interface Request {
      user?: Models.IUser | null;
    }
  }
}
