import { Request, Response, NextFunction } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { generateLast12MonthsData } from "../utils/analytics.generator";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.model";

//get users analytics for admin
export const getUsersAnalytics = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const usersAnalytics = await generateLast12MonthsData(userModel);
      if (!usersAnalytics)
        return next(
          new ErrorHandler("Error occurred fetching user analytics", 400)
        );

      res.status(200).json({
        success: true,
        usersAnalytics,
        message: "User analytics",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//get courses analytics for admin
export const getCoursesAnalytics = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseAnalytics = await generateLast12MonthsData(CourseModel);
      if (!courseAnalytics)
        return next(
          new ErrorHandler("Error occurred fetching courses analytics", 400)
        );

      res.status(200).json({
        success: true,
        courseAnalytics,
        message: "Courses analytics",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//get orders analytics for admin
export const getOrdersAnalytics = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ordersAnalytics = await generateLast12MonthsData(OrderModel);
      if (!ordersAnalytics)
        return next(
          new ErrorHandler("Error occurred fetching orders analytics", 400)
        );

      res.status(200).json({
        success: true,
        ordersAnalytics,
        message: "Orders analytics",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);