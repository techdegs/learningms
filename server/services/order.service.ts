import { Response, NextFunction } from "express";
import OrderModel from "../models/order.model";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";

//create new order
export const newOrder = CatchAsyncErrors(
  async (data: any, res: Response, next: NextFunction) => {
    const order = await OrderModel.create(data);
    res.status(200).json({
      success: true,
      message: "Thank you for purchasing this course",
      order,
    });
  }
);

//get all orders
export const getAllOrders = async (res: Response, next: NextFunction) => {
  const orders = await OrderModel.find().sort({ createdAt: -1 });
  if (!orders)
    return next(new ErrorHandler("Something went wrong fetching orders", 500));
  if (orders.length <= 0) return next(new ErrorHandler("No orders Found", 400));

  res.status(200).json({
    success: true,
    orders,
    message: "Fetched orders successfully",
  });
};
