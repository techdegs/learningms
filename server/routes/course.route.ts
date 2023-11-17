import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  addAnswer,
  addQuestion,
  addReplyToReview,
  addReview,
  deleteCourseAdmin,
  editCourse,
  fetchAllCourses,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";

const courseRouter = express.Router();

//add course by admin
courseRouter.post(
  "/create-course",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);

//edit single course by admin
courseRouter.put(
  "/edit-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);

//fetch single course for everyone, frontend
courseRouter.get("/fetch-course/:id", getSingleCourse);

//Fetch all courses for everyone, frontend
courseRouter.get("/fetch-courses", getAllCourses);

//Fetch Course Content for user if he/she has purchased
courseRouter.get("/get-user-course/:id", isAuthenticated, getCourseByUser);

//Add question
courseRouter.put("/add-question/", isAuthenticated, addQuestion);

//Add Answer
courseRouter.put("/add-answer/", isAuthenticated, addAnswer);

//Add Review
courseRouter.put("/add-review/:id", isAuthenticated, addReview);

//Reply Review
courseRouter.put(
  "/reply-review",
  isAuthenticated,
  authorizeRoles("admin"),
  addReplyToReview
);

//Fetch all courses for admin
courseRouter.get("/all-courses", isAuthenticated, authorizeRoles("admin"), fetchAllCourses);
courseRouter.delete(
  "/delete-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteCourseAdmin
);
export default courseRouter;
