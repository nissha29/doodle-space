import { Router } from "express";
import { createRoom } from "../controllers/createRoom.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const roomRouter: Router = Router();

roomRouter.post('/', auth, createRoom);

export default roomRouter;