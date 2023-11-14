import { IUser } from "../../models/user.model";
import { Request } from 'express';

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
    }
  }
}
