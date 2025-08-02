import { CreateRoomSchema } from "@repo/common/types";
import { Response } from "express";
import { emitError, emitSuccess } from "../utils/response.util.js";
import { CustomRequest } from "../types/express.js";
import { prismaClient } from "@repo/prisma/client";

const createRoom = async (req: CustomRequest, res: Response) => {
    try {
        const { error, data } = CreateRoomSchema.safeParse(req.body);
        if (error) {
            emitError({ res, error: `Missing Link Id, ${error}`, statusCode: 400 });
            return;
        }

        if (!req.userId) {
            emitError({ res, error: `You are not authorized`, statusCode: 400 });
            return;
        }

        const room = await prismaClient.room.create({
            data: {
                adminId: req.userId,
                linkId: data.linkId
            }
        })

        emitSuccess({
            res,
            result: { room },
            message: `Room created successfully`,
        });
        return;
    } catch (error) {
        emitError({ res, error: `Error while creating room, ${error}` });
        return;
    }
}

const roomShapes = async (req: CustomRequest, res: Response) => {
    try {
        const roomId = req.params.roomId;
        if (!roomId) {
            emitError({ res, error: `No room`, statusCode: 400 });
            return;
        }

        const isRoom = await prismaClient.room.findFirst({
            where: { linkId: roomId }
        });

        if (!isRoom) {
            console.log('room not found')
            emitError({ res, error: `Room not found`, statusCode: 400 });
            return;
        }

        const shapes = await prismaClient.shape.findMany({
            where: { roomId: roomId },
            take: 50,
            orderBy: {
                id: "asc"
            },
        })

        emitSuccess({
            res,
            result: { shapes: shapes },
            message: `Shapes fetched successfully`,
        });
    } catch (error) {
        emitError({ res, error: `Error while fetching room Shapes, ${error}` });
        return;
    }
}

export {
    createRoom,
    roomShapes,
}