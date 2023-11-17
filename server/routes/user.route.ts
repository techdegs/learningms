import express from "express";
import {
  activateUser,
  deleteUser,
  fetchAllUsers,
  getUserInfo,
  loginUser,
  logoutUser,
  registerUser,
  socialAuth,
  updateAccessToken,
  updatePassword,
  updateProfilePicture,
  updateUserInfo,
  updateUserRole,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const userRouter = express.Router();

//register user
userRouter.post("/register", registerUser);
//verify token
userRouter.post("/verifyToken", activateUser);
userRouter.post("/login-user", loginUser);
userRouter.post("/logout-user", isAuthenticated, logoutUser);
userRouter.post("/social-auth", socialAuth);
userRouter.get("/update-access-token", updateAccessToken);
userRouter.get("/me", isAuthenticated, getUserInfo);
userRouter.put("/update-user", isAuthenticated, updateUserInfo);
userRouter.put("/update-password", isAuthenticated, updatePassword);
userRouter.put("/update-avatar", isAuthenticated, updateProfilePicture);
userRouter.get(
  "/all-users",
  isAuthenticated,
  authorizeRoles("admin"),
  fetchAllUsers
);
userRouter.put(
  "/update-user-role",
  isAuthenticated,
  authorizeRoles("admin"),
  updateUserRole
);

userRouter.delete(
  "/delete-user/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteUser
);
export default userRouter;
