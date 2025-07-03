import { Router } from "express";
import { createRoom, roomChats } from "../controllers/room.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const roomRouter: Router = Router();

roomRouter.post('/', auth, createRoom);
roomRouter.get('/chat/:roomId', auth, roomChats);

export default roomRouter;