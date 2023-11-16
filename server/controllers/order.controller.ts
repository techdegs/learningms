import { Request, Response, NextFunction } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import { getAllOrders, newOrder } from "../services/order.service";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";

// Create new Order
export const createOder = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_Info } = req.body as IOrder;
      const userId = req.user?._id;

      if (!courseId)
        return next(
          new ErrorHandler("Sorry something went wrong with this course", 400)
        );

      const course = await CourseModel.findById(courseId);

      if (!course) return next(new ErrorHandler("Course not found", 404));

      if (!userId)
        return next(
          new ErrorHandler("Sorry error occurred with this user", 400)
        );

      let purchasedCourses = course.purchased;
      if (purchasedCourses === undefined) {
        purchasedCourses = 0;
      }

      const user = await userModel.findById(userId);

      if (!user) return next(new ErrorHandler("User not found", 400));

      //check if this user has purchased this course
      const courseExistInUser = user?.courses.some(
        (course: any) => course._id.toString() === courseId
      );

      if (courseExistInUser)
        return next(
          new ErrorHandler("You have already purchased this course", 400)
        );

      const data: any = {
        courseId: course._id,
        userId: user._id,
        payment_Info,
      };

      const mailData = {
        order: {
          _id: course._id.toString().split(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-Us", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../emails/order-confirmation.ejs"),
        { order: mailData }
      );

      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Order Confirmation",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }

      //Add user to course
      user?.courses.push(course?._id);

      await user?.save();

      await NotificationModel.create({
        user: user?._id,
        title: "New order",
        message: `You have a new order from ${course?.name}`,
      });

      //Create Order
      newOrder(data, res, next);
      course.purchased = purchasedCourses + 1;
      await course?.save();
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//Fetch all order
export const fetchOrders = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrders(res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
