import { Router } from "express";
import { createRoom, roomIdBySlug, roomShapes } from "../controllers/room.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const roomRouter: Router = Router();

roomRouter.post('/', auth, createRoom);
roomRouter.get('/shapes/:roomId', auth, roomShapes);
roomRouter.get('/:slug', auth, roomIdBySlug);

export default roomRouter;