import { Router } from "express";
import { createRoom, roomShapes } from "../controllers/room.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const roomRouter: Router = Router();

roomRouter.post('/create', auth, createRoom);
roomRouter.get('/shapes/:roomId', auth, roomShapes);

export default roomRouter;