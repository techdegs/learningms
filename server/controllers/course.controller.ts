import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";

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

// Get Course Content for user if he/she has purchased -- private user
export const getCourseByUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      if (!courseId)
        return next(
          new ErrorHandler("Sorry something went wrong. Try again Later", 400)
        );
      const userCourseList = req.user?.courses;

      const courseExists = userCourseList?.find(
        (course: any) => course._id.toString() === courseId
      );

      if (!courseExists) {
        return next(
          new ErrorHandler(
            "You are not eligible to access this course. Purchase it to get full access. Thank You",
            400
          )
        );
      }

      const course = await CourseModel.findById(courseId);

      const content = course?.courseData;

      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Add Question in course
interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string; //or course data id
}

export const addQuestion = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId } = req.body as IAddQuestionData;
      if (!mongoose.Types.ObjectId.isValid(courseId))
        return next(new ErrorHandler("Sorry! Invalid content Id", 400));

      const course = await CourseModel.findById(courseId);

      if (!course)
        return next(
          new ErrorHandler("Sorry! Couldn't add question try again later", 400)
        );

      //search 1
      // const courseContent = course?.courseData?.find(
      //   (item: any) => item._id === contentId
      // );

      //alternative search 2
      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );

      if(!courseContent) return next(new ErrorHandler("Sorry! Content unavailable", 400));

      //create a new question object
      const newQuestion:any = {
        user: req.user,
        question,
        questionReplies:[]
      }

      //add this question to our course content
      courseContent.questions.push(newQuestion);

      //save the updated course
      await course?.save();

      res.status(200).json({
        success: true,
        newQuestion,
        course,
        message: "Question asked successfully. Kindly wait for reply"
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
