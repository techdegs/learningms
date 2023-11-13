import express from 'express'
import { activateUser, loginUser, logoutUser, registerUser, updateAccessToken } from '../controllers/user.controller'
import { authorizeRoles, isAuthenticated } from '../middleware/auth';

const userRouter = express.Router();

//register user
userRouter.post('/register', registerUser);
//verify token
userRouter.post("/verifyToken", activateUser);
userRouter.post("/login-user", loginUser);
userRouter.post("/logout-user", isAuthenticated, logoutUser);

userRouter.get('/update-access-token', updateAccessToken)

export default userRouter