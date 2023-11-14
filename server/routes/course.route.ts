import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { editCourse, getSingleCourse, uploadCourse } from "../controllers/course.controller";

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
export default courseRouter;
