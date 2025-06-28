import { Router } from "express";
import { createRoom } from "../controllers/createRoom.controller";
import { auth } from "../middlewares/auth.middleware";

const roomRouter = Router();

roomRouter.post('/room', auth, createRoom);