import { Response } from "express";
import CourseModel from "../models/course.model";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";

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
