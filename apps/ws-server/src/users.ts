import { IUser } from "./types/types.js";
import WebSocket from "ws";
import { prismaClient } from '@repo/prisma/client'

// have to optimise the TC from O(n) to O(1) for user array traversing, create maps --------------------------------------
// also add other checks here for validations
const users: IUser[] = [];

const addNewConnection = (ws: WebSocket, userId: string, username: string) => {
    users.push({ ws, userId, username, rooms: [] })
}

const roomExists = async (roomId: number) => {
    try {
        if (!roomId || typeof (roomId) !== 'number') {
            return false;
        }
        const room = await prismaClient.room.findFirst({
            where: { id: roomId }
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

const joinRoom = async (userId: string, roomId: number) => {
    if (! await roomExists(roomId)) {
        console.log(`Room doesn't exists`)
    }

    const user = users.find(user => user.userId == userId);
    if (!user) {
        console.log(`No user connection found`);
        return;
    }
    user?.rooms.push(roomId);
    user.ws.send(JSON.stringify({
        type: 'joinRoom',
        message: `${user.username} Room joined successfully`
    }))
}

const leaveRoom = async (userId: string, roomId: number) => {
    if (! await roomExists(roomId)) {
        console.log(`Room doesn't exists`);
    }

    const user = users.find(user => user.userId == userId);
    if (!user) {
        console.log(`No user connection found`);
        return;
    }

    user.rooms = user?.rooms.filter(currRoomId => currRoomId === roomId);
}

const sendChatToRoom = async (userId: string, message: string, roomId: number) => {
    if (! await roomExists(roomId)) {
        console.log(`Room doesn't exists`);
    }

    // use queues here, otherwise it will take long time to broadcast messages coz first it will put the message in DB then broadcast ---------------------------------
    await prismaClient.chat.create({
        data: {
            roomId,
            userId,
            message,
        }
    })
    // -------------------------------

    users.forEach(user => {
        if (user.rooms.includes(roomId)) {
            user.ws.send(JSON.stringify({
                type: 'chat',
                message,
                roomId,
            }))
        }
    })
}

export {
    addNewConnection,
    joinRoom,
    leaveRoom,
    sendChatToRoom
}