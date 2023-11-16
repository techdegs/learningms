import { NextFunction, Response } from "express";
import { redis } from "../utils/redis";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";

//Get user by id
export const getUserById = async (id: string, res: Response) => {
  //fetch from redis instead of mongoose
  const userJson = await redis.get(id);
  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(201).json({
      success: true,
      user,
    });
  }
};

//get all users
export const getAllUsers = async (res: Response, next: NextFunction) => {
  const users = await userModel.find().sort({ createdAt: -1 });
  if (!users)
    return next(new ErrorHandler("Something went wrong fetching users", 500));
  if (users.length <= 0) return next(new ErrorHandler("No Users Found", 400));
  
  res.status(200).json({
    success: true,
    users,
    message: "Fetched users successfully",
  });
};
