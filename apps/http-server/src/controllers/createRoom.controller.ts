import { CreateRoomSchema } from "@repo/common/types";
import { Response } from "express";
import { emitError, emitSuccess } from "../utils/response.util.js";
import { CustomRequest } from "../types/express.js";
import { prismaClient } from "@repo/prisma/client";

const createRoom = async(req: CustomRequest, res: Response) => {
    try {
        const { error, data } = CreateRoomSchema.safeParse(req.body);
        if (error) {
            emitError({ res, error: `Incorrect Inputs, ${error}`, statusCode: 400 });
            return;
        }

        if (!req.userId) {
            emitError({ res, error: `You are not authorized`, statusCode: 400 });
            return;
        }

        const { slug } = data;

        const room = await prismaClient.room.create({
            data: {
                slug,
                adminId: req.userId,
            }
        })

        emitSuccess({
            res,
            data: { room },
            message: `Room created successfully`,
        });
        return;
    } catch (error) {
        emitError({ res, error: `Error while creating room, ${error}` });
        return;
    }
}

export {
    createRoom
}