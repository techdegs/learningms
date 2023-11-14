import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { addQuestion, editCourse, getAllCourses, getCourseByUser, getSingleCourse, uploadCourse } from "../controllers/course.controller";

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
courseRouter.get(
  "/fetch-course/:id",
  getSingleCourse
);

//Fetch all courses for everyone, frontend
courseRouter.get("/fetch-courses", getAllCourses);

//Fetch Course Content for user if he/she has purchased 
courseRouter.get("/get-user-course/:id", isAuthenticated, getCourseByUser);

courseRouter.put("/add-question/", addQuestion);


export default courseRouter;