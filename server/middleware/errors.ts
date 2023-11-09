import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorsMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server error";

  //wrong mongo db ID error
  if (err.name === "CastError") {
    const message = `Request not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  //wrong jwt error - Header error
  if (err.name === "JsonWebTokenError") {
    const message = "Json web token is invalid. Try Again.";
    err = new ErrorHandler(message, 401);
  }

  //wrong jwt error - Token expired
  if (err.name === "TokenExpiredError") {
    const message = "Your session has expired. Please try again.";
    err = new ErrorHandler(message, 401);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
