import { Router } from "express";
import { signup, signin } from "../controllers/user.controller";

const userRouter = Router();

userRouter.post('/signup', signup);
userRouter.post('/signin', signin);