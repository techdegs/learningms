import express from 'express'
import { registerUser } from '../controllers/user.controller'

const userRouter = express.Router();

//register user
userRouter.post('/register', registerUser);

export default userRouter