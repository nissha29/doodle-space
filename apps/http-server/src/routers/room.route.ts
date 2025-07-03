import { Router } from "express";
import { createRoom, roomChats, roomIdBySlug } from "../controllers/room.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const roomRouter: Router = Router();

roomRouter.post('/', auth, createRoom);
roomRouter.get('/chats/:roomId', auth, roomChats);
roomRouter.get('/:slug', auth, roomIdBySlug);

export default roomRouter;