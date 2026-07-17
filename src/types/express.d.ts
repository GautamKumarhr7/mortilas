import { User } from '../models/hr/user.model.js';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
