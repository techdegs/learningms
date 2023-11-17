import { NextFunction, Response } from "express";
import CourseModel from "../models/course.model";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";

export const createCourse = CatchAsyncErrors(
  async (data: any, res: Response) => {
    const course = await CourseModel.create(data);
    res.status(201).json({
      success: true,
      course,
      message: "Course created successfully!.",
    });
  }
);

//get all courses
export const getCourses = async (res: Response, next: NextFunction) => {
  const courses = await CourseModel.find().sort({ createdAt: -1 });
  if (!courses)
    return next(new ErrorHandler("Something went wrong fetching courses", 500));
  if (courses.length <= 0)
    return next(new ErrorHandler("No courses Found", 400));

  res.status(200).json({
    success: true,
    courses,
    message: "Fetched courses successfully",
  });
};
