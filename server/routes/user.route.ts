import express from 'express'
import { activateUser, loginUser, registerUser } from '../controllers/user.controller'

const userRouter = express.Router();

//register user
userRouter.post('/register', registerUser);
//verify token
userRouter.post("/verifyToken", activateUser);
userRouter.post("/login-user", loginUser);

export default userRouter