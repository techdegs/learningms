import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";

export const uploadCourse = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "Courses",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      //   else{
      //     return next(new ErrorHandler('Upload course thumbnail', 400));
      //   }
      createCourse(data, res, next);
      //res.json(data)
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Edit Course
export const editCourse = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;

      const courseId = req.params.id;

      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        { $set: data },
        { new: true }
      );

      if (!courseId)
        return next(
          new ErrorHandler(
            "Sorry something went wrong with this course. Try again later",
            400
          )
        );

      if (!course) return next(new ErrorHandler("Course not found", 400));

      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "Courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      res.status(201).json({
        success: true,
        course,
        message: "Course updated successfully!.",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Get Single Course -- without purchasing - Everyone can access
export const getSingleCourse = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      if (!courseId)
        return next(new ErrorHandler("No Course Id. Try again", 400));

      const isCachedExist = await redis.get(courseId);
      if (isCachedExist) {
        console.log("Hitting redis db");
        const course = JSON.parse(isCachedExist);

        if (!course)
          return next(
            new ErrorHandler("Sorry Error occurred fetching the course", 400)
          );

        res.status(200).json({
          success: true,
          course,
          message: "Fetched Course successfully",
        });
      } else {
        console.log("Hitting mongo db");
        const course = await CourseModel.findById(courseId).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );

        if (!course)
          return next(
            new ErrorHandler("Sorry Error occurred fetching the course", 400)
          );

        //cache course
        await redis.set(courseId, JSON.stringify(course));

        res.status(200).json({
          success: true,
          course,
          message: "Fetched Course successfully",
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Get all courses for the public
export const getAllCourses = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCachedCourses = await redis.get("allCourses");
      if (isCachedCourses) {
        console.log("Hitting Redis Db");
        const courses = JSON.parse(isCachedCourses);

        if (!courses)
          return next(
            new ErrorHandler("Sorry Error occurred fetching courses", 400)
          );

        res.status(200).json({
          success: true,
          courses,
          message: "Courses Fetched Successfully",
        });

      } else {
        console.log("Hitting mongo db");
        const courses = await CourseModel.find().select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );

        if (!courses)
          return next(
            new ErrorHandler("Sorry Error occurred fetching courses", 400)
          );

        await redis.set("allCourses", JSON.stringify(courses));

        res.status(200).json({
          success: true,
          courses,
          message: "Courses Fetched Successfully",
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
