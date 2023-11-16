import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import NotificationModel from "../models/notification.model";
import cron from "node-cron";

//Get all notifications for admin
export const getNotifications = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await NotificationModel.find().sort({
        createdAt: -1,
      });
      if (!notifications)
        return next(new ErrorHandler("Sorry something went wrong", 400));
      if (notifications.length <= 0)
        return next(
          new ErrorHandler("Sorry You don't have any notifications yet", 400)
        );
      res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update notification status --admin
export const updateNotification = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifId = req.params.id;

      if (!notifId)
        return next(new ErrorHandler("Sorry Something went wrong", 400));

      const notification = await NotificationModel.findById(notifId);
      if (!notification)
        return next(new ErrorHandler("No notification yet", 400));

      notification.status
        ? (notification.status = "read")
        : notification.status;
      await notification.save();

      const notifications = await NotificationModel.find().sort({
        createdAt: -1,
      });

      res.status(201).json({
        success: true,
        message: "Notification read",
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Delete read notifications after 1 month with node-cron
cron.schedule("0 0 0 * * *", async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await NotificationModel.deleteMany({
    status: "read",
    createdAt: { $lt: thirtyDaysAgo },
  });
  console.log("Deleted read notification")
});
