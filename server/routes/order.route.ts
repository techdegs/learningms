import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createOder, fetchOrders } from "../controllers/order.controller";

const orderRouter = express.Router();

orderRouter.post("/create-order", isAuthenticated, createOder);
orderRouter.get(
  "/all-orders",
  isAuthenticated,
  authorizeRoles("admin"),
  fetchOrders
);

export default orderRouter;
