import { IUser } from "./types/types.js";
import WebSocket from "ws";
import { prismaClient } from '@repo/prisma/client'
import { Shape } from "@repo/common/types";

// have to optimise the TC from O(n) to O(1) for user array traversing, create maps --------------------------------------
// also add other checks here for validations
const users: IUser[] = [];

const addNewConnection = (ws: WebSocket, userId: string, username: string) => {
    users.push({ ws, userId, username, rooms: [] })
}

const roomExists = async (roomId: string) => {
    try {
        if (!roomId || typeof (roomId) !== 'string') {
            return false;
        }
        const room = await prismaClient.room.findFirst({
            where: { linkId: roomId }
        })

        if (!room) {
            return false;
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const joinRoom = async (userId: string, roomId: string) => {
    if (! await roomExists(roomId)) {
        console.log(`Room doesn't exists`)
        return;
    }

    const user = users.find(user => user.userId == userId);
    if (!user) {
        console.log(`No user connection found`);
        return;
    }
    user?.rooms.push(roomId);
    console.log('joined');

    users.forEach(user => {
        if (user.rooms.includes(roomId)) {
            user.ws.send(JSON.stringify({
                type: 'joinRoom',
                message: `${user.username} has joined room`
            }))
        }
    })
}

const leaveRoom = async (userId: string, roomId: string) => {
    if (! await roomExists(roomId)) {
        console.log(`Room doesn't exists`);
    }

    const user = users.find(user => user.userId == userId);
    if (!user) {
        console.log(`No user connection found`);
        return;
    }

    user.rooms = user?.rooms.filter(currRoomId => currRoomId === roomId);
    users.forEach(user => {
        if (user.rooms.includes(roomId)) {
            user.ws.send(JSON.stringify({
                type: 'leaveRoom',
                message: `${user.username} has left room`
            }))
        }
    })
}

const createShape = async (userId: string, shape: Shape, roomId: string) => {
    if (! await roomExists(roomId)) {
        console.log(`Room doesn't exists`);
        return;
    }

    // use queues here, otherwise it will take long time to broadcast messages coz first it will put the message in DB then broadcast ---------------------------------
    await prismaClient.shape.create({
        data: {
            id: shape.id,
            roomId,
            userId,
            shape,
        }
    })
    // -------------------------------

    users.forEach(user => {
        if (user.rooms.includes(roomId)) {
            user.ws.send(JSON.stringify({
                type: 'create',
                shape,
                roomId,
            }))
        }
    })
}

const updateShape = async (userId: string, shape: Shape, roomId: string) => {
    if (! await roomExists(roomId)) {
        console.log(`Room doesn't exists`);
        return;
    }

    await prismaClient.shape.update({
        where: { id: shape.id },
        data: { shape }
    })

    users.forEach(user => {
        if (user.rooms.includes(roomId)) {
            user.ws.send(JSON.stringify({
                type: 'update',
                shape,
                roomId,
            }))
        }
    })
}                                                                                               

const deleteShape = async (userId: string, shapeId: string, roomId: string) => {
    if (! await roomExists(roomId)) {
        console.log(`Room doesn't exists`);
        return;
    }

    await prismaClient.shape.delete({
        where: { id: shapeId }
    })

    users.forEach(user => {
        if (user.rooms.includes(roomId)) {
            user.ws.send(JSON.stringify({
                type: 'delete',
                shapeId,
                roomId,
            }))
        }
    })
}

export {
    addNewConnection,
    joinRoom,
    leaveRoom,
    createShape,
    updateShape,
    deleteShape,
}