import { IUser } from "./types/types.js";
import WebSocket from "ws";
import { prismaClient } from '@repo/prisma/client'
import { Shape } from "@repo/common/types";

const users = new Map<string, IUser>();

const getUser = (userId: string) => {
    return users.get(userId);
}

const addConnection = (ws: WebSocket, userId: string, username: string) => {
    users.set(userId, { ws, userId, username, rooms: new Set() });
    console.log(`User connected: ${username} (Total online: ${users.size})`);
};

const removeConnection = (userId: string) => {
    const user = getUser(userId);
    if (user) {
        console.log(`User disconnected: ${user.username}`);
        users.delete(userId);
    }
};

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

const getParticipants = (roomId: string) => {
    const participants = [];
    for (const user of users.values()) {
        if (user.rooms.has(roomId)) {
            participants.push({ id: user.userId, name: user.username });
        }
    }
    return participants;
};

const broadcastToRoom = (roomId: string, message: object) => {
    const serializedMessage = JSON.stringify(message);
    for (const user of users.values()) {
        if (user.rooms.has(roomId)) {
            user.ws.send(serializedMessage);
        }
    }
};

const joinRoom = async (userId: string, roomId: string) => {
    if (!await roomExists(roomId)) {
        console.log(`Room ${roomId} doesn't exist`);
        return;
    }

    const user = getUser(userId);
    if (!user) {
        console.log(`No user connection found for ID: ${userId}`);
        return;
    }

    if (user.rooms.has(roomId)) {
        console.log(`${user.username} is already in room ${roomId}`);
        return;
    }

    user.rooms.add(roomId);
    console.log(`${user.username} joined room ${roomId}`);

    const join = {
        type: 'joinRoom',
        payload: {
            username: user.username,
            roomId,
        }
    };

    const usersList = getParticipants(roomId);
    const list = {
        type: 'usersList',
        payload: {
            participants: usersList,
            roomId,
        }
    };

    broadcastToRoom(roomId, join);
    broadcastToRoom(roomId, list);
};

const leaveRoom = async (userId: string, roomId: string) => {
    const user = getUser(userId);
    if (!user || !user.rooms.has(roomId)) {
        return;
    }

    user.rooms.delete(roomId);
    console.log(`${user.username} left room ${roomId}`);

    const leave = {
        type: 'leaveRoom',
        payload: {
            username: user.username,
            roomId,
        }
    };

    const usersList = getParticipants(roomId);
    const list = {
        type: 'usersList',
        payload: {
            participants: usersList,
            roomId,
        }
    };

    broadcastToRoom(roomId, leave);
    broadcastToRoom(roomId, list);
};

const createShape = async (userId: string, shape: Shape, roomId: string) => {
    if (!await roomExists(roomId)) return;

    try {
        await prismaClient.shape.create({
            data: {
                id: shape.id,
                roomId,
                userId,
                shape,
            }
        });

        broadcastToRoom(roomId, {
            type: 'create',
            payload: { shape, roomId }
        });
    } catch (error) {
        console.error(`Error while creating shape`);
    }
};

const updateShape = async (userId: string, shape: Shape, roomId: string) => {
    if (!await roomExists(roomId)) return;

    try {
        await prismaClient.shape.update({
            where: { id: shape.id },
            data: { shape }
        });

        broadcastToRoom(roomId, {
            type: 'update',
            payload: { shape, roomId }
        });
    } catch (error: any) {
        if (error.code === 'P2025') {
            console.warn(`Attempted to update a shape with ID [${shape.id}] that does not exist. Skipping.`);
        } else {
            console.error(`An unexpected error occurred while updating shape [${shape.id}]:`, error);
        }
    }
};

const deleteShape = async (userId: string, shapeId: string, roomId: string) => {
    if (!await roomExists(roomId)) return;

    try {
        await prismaClient.shape.delete({
            where: { id: shapeId }
        });

        broadcastToRoom(roomId, {
            type: 'delete',
            payload: { shapeId, roomId }
        });
    } catch (error: any) {
        if (error.code === 'P2025') {
            console.warn(`Attempted to delete a shape with ID [${shapeId}] that does not exist. Skipping.`);
        } else {
            console.error(`An unexpected error occurred while updating shape [${shapeId}]:`, error);
        }
    }
};

export {
    getUser,
    addConnection,
    removeConnection,
    joinRoom,
    leaveRoom,
    createShape,
    updateShape,
    deleteShape,
}