import { Router } from "express";
import { signup, signin, me } from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const userRouter: Router = Router();

userRouter.post('/signup', signup);
userRouter.post('/signin', signin);
userRouter.post('/me', auth, me);

export default userRouter;