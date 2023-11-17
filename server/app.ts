import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
require("dotenv").config();
import { ErrorsMiddleware } from "./middleware/errors";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";

export const app = express();

//body parser
app.use(express.json({ limit: "50mb" }));

//cooker parser
app.use(cookieParser());

//enable all CORS => cross origin resource sharing request
//secure practice to prevent others from accessing from different server
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

app.use("/api/v1", userRouter); //user Routes
app.use("/api/v1", courseRouter) //Course Routes
app.use("/api/v1", orderRouter) //Order Routes
app.use("/api/v1", notificationRouter) //Notifications Routes
app.use("/api/v1", analyticsRouter); //Analytics routes

//Testing route
app.get("/api/v1/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "server is working",
  });
});

//unknown router
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} is not available`) as any;
  err.statusCode = 404;
  next(err);
});

//Errors
app.use(ErrorsMiddleware);


