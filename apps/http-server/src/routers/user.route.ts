import { Router } from "express";
import { signup, signin } from "../controllers/user.controller.js";

const userRouter: Router = Router();

userRouter.post('/signup', signup);
userRouter.post('/signin', signin);

export default userRouter;