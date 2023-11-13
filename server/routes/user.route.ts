import express from 'express'
import { activateUser, getUserInfo, loginUser, logoutUser, registerUser, socialAuth, updateAccessToken } from '../controllers/user.controller'
import { authorizeRoles, isAuthenticated } from '../middleware/auth';

const userRouter = express.Router();

//register user
userRouter.post('/register', registerUser);
//verify token
userRouter.post("/verifyToken", activateUser);
userRouter.post("/login-user", loginUser);
userRouter.post("/logout-user", isAuthenticated, logoutUser);
userRouter.post("/social-auth", socialAuth)
userRouter.get('/update-access-token', updateAccessToken)
userRouter.get('/me', isAuthenticated, getUserInfo);

export default userRouter