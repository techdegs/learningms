import { Request, Response, NextFunction } from "express";
import { CatchAsyncErrors } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";
require("dotenv").config();

export interface IGetUserAuthInfoRequest extends Request {
  user?: any; // or any other type
}

// Authenticated User
export const isAuthenticated = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string;

    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this page", 400)
      );
    }

    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler("access token is not valid", 400));
    }

    const user = await redis.get(decoded.id);

    if (!user) {
      return next(new ErrorHandler("Please login to access this resources", 400));
    }

    //create custom d.ts to accept user to global namespace or add user to Request
    req.user = JSON.parse(user);
    next();
  }
);

//Validate user role - admin -> super fucntions and user -> normal functions
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if(!roles.includes(req.user?.role || '')){
      return next(new ErrorHandler( `Role: ${req.user?.role} is not allowed to access this resources`, 403));
    }
    next();
  };
};