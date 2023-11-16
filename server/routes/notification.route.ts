import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  getNotifications,
  updateNotification,
} from "../controllers/notification.controller";

const notificationRouter = express.Router();

//all notifications for admin
notificationRouter.get(
  "/all-notifications",
  isAuthenticated,
  authorizeRoles("admin"),
  getNotifications
);

//update notification by admin
notificationRouter.put(
  "/update-notification/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateNotification
);

export default notificationRouter;
