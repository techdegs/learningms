import {Response, NextFunction } from "express";
import OrderModel from "../models/order.model";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";

//create new order
export const newOrder = CatchAsyncErrors(
  async (data: any, res:Response, next: NextFunction) => {
    const order = await OrderModel.create(data);
          res.status(200).json({
            success: true,
            message: "Thank you for purchasing this course",
            order
          });
  }
);
