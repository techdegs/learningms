import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { editCourse, getAllCourses, getSingleCourse, uploadCourse } from "../controllers/course.controller";

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
export default courseRouter;
