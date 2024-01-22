import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse, getCourses } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";

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

      //GET COURSE ID TO FETCH COURSES
      const courseId = req.params.id;

      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        { $set: data },
        { new: true }
      );

      //return error if course id was not found
      if (!courseId)
        return next(
          new ErrorHandler(
            "Sorry something went wrong with this course. Try again later",
            400
          )
        );

      if (!course) return next(new ErrorHandler("Course not found", 400));

      //upload videos thumbnail to cloudinary and if video thumbnail exist destroy or delete the video
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
        await redis.set(courseId, JSON.stringify(course), "EX", 604800);

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

//Get all courses for the public view
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

      if (!courseContent)
        return next(new ErrorHandler("Sorry! Content unavailable", 400));

      //create a new question object
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      //add this question to our course content
      courseContent.questions.push(newQuestion);

      //save the updated course
      await course?.save();

      await NotificationModel.create({
        user: req.user?._id,
        title: "New Question",
        message: `You have a new question from ${courseContent.title}`,
      });

      res.status(200).json({
        success: true,
        newQuestion,
        course,
        message: "Question asked successfully. Kindly wait for reply",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//add answer in course question
interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}
export const addAnswer = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId } =
        req.body as IAddAnswerData;
      if (!mongoose.Types.ObjectId.isValid(courseId))
        return next(new ErrorHandler("Sorry! Invalid content Id", 400));

      const course = await CourseModel.findById(courseId);

      if (!course)
        return next(
          new ErrorHandler("Sorry! Couldn't add question try again later", 400)
        );

      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!courseContent)
        return next(new ErrorHandler("Sorry! Content unavailable", 400));

      const question = courseContent?.questions?.find((item: any) =>
        item._id.equals(questionId)
      );

      if (!question)
        return next(
          new ErrorHandler(
            "Sorry something went wrong replying to the question",
            400
          )
        );

      //create a new answer
      const newAnswer: any = {
        user: req.user,
        answer,
      };

      //add this answer to this question
      question.questionReplies.push(newAnswer);

      //save the updated course
      await course?.save();

      if (req.user?._id === question?.user?._id) {
        //create a notification
        await NotificationModel.create({
          user: req.user?._id,
          title: "New Question Answered",
          message: `Your have a new question reply on ${courseContent.title}`,
        });
      } else {
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };
        const html = await ejs.renderFile(
          path.join(__dirname, "../emails/question-reply.ejs"),
          data
        );

        try {
          await sendMail({
            email: question.user.email,
            subject: "Question Reply",
            template: "question-reply.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 400));
        }
      }

      res.status(200).json({
        success: true,
        message: "Answered successfully",
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Add Review in course

interface IAddReviewData {
  review: string;
  courseId: string;
  rating: number;
  userId: string;
}

export const addReview = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      if (!courseId)
        return next(new ErrorHandler("Sorry, Error occurred", 400));

      const courseExist = userCourseList?.find(
        (course: any) => course._id === courseId
      );

      if (!courseExist)
        return next(
          new ErrorHandler(
            "You are not eligible to add review to this course",
            400
          )
        );

      const course = await CourseModel.findById(courseId);
      if (!course)
        return next(new ErrorHandler("Sorry, Couldn't fetch the course", 400));

      const { review, rating } = req.body as IAddReviewData;

      const reviewData: any = {
        user: req.user,
        comment: review,
        rating,
      };

      course?.reviews.push(reviewData);

      let avgRev = 0;
      course?.reviews.forEach((rev: any) => {
        avgRev += rev.rating;
      });

      if (course) {
        course.ratings = avgRev / course?.reviews.length;
      }

      await course?.save();

      const notification = {
        title: "New Review on your course!",
        message: `${req.user?.name} has given  a review on your course -> ${course?.name}`,
      };

      //Create Notification

      res.status(200).json({
        success: true,
        message: "Thank you for reviewing on this course",
        course,
        avgRev,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Replies on in review
interface IAddReviewData {
  comment: string;
  courseId: string;
  reviewedId: string;
}
export const addReplyToReview = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewedId } = req.body as IAddReviewData;
      const course = await CourseModel.findById(courseId);
      if (!course) return next(new ErrorHandler("Course not found", 400));

      const review = course?.reviews?.find(
        (rev: any) => rev._id.toString() === reviewedId
      );

      if (!review)
        return next(new ErrorHandler("Review to reply not found", 400));

      const replyData: any = {
        user: req?.user,
        comment,
      };

      if (!review.commentReplies) {
        review.commentReplies = [];
      }

      review.commentReplies?.push(replyData);

      await course?.save();

      res.status(200).json({
        success: true,
        message: "Replied Successfully",
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Fetch all courses for admin
export const fetchAllCourses = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getCourses(res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Delete course - admin
export const deleteCourseAdmin = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Sorry! Course not found", 400));
      if (!id) return next(new ErrorHandler("Course not found", 404));

      const course = await CourseModel.findById(id);
      if (!course) return next(new ErrorHandler("Course not found", 404));

      const deleteCourse = await course.deleteOne({ id });
      if (!deleteCourse)
        return next(
          new ErrorHandler("course was not deleted. Try again later", 404)
        );

      const deleteCourseRd = await redis.del(id);

      res.status(200).json({
        success: true,
        message: "Course Deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
