import { IUser } from "./types/types.js";
import WebSocket from "ws";
import { prismaClient } from '@repo/prisma/client'
import { Shape } from "@repo/common/types";

const users = new Map<string, IUser>();

const shapeOperationQueue: any[] = [];
let isProcessingQueue = false;

const processShapeQueue = async () => {
    if (isProcessingQueue || shapeOperationQueue.length === 0) {
        return;
    }
    isProcessingQueue = true;

    const operation = shapeOperationQueue.shift();

    try {
        if (operation.type === 'create') {
            await prismaClient.shape.create({ data: operation.data });
        } else if (operation.type === 'update') {
            await prismaClient.shape.update({ where: { id: operation.data.id }, data: { shape: operation.data.shape } });
        } else if (operation.type === 'delete') {
            await prismaClient.shape.delete({ where: { id: operation.shapeId } });
        }
    } catch (error) {
        console.log('error');
    }

    isProcessingQueue = false;
    setImmediate(processShapeQueue);
};


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
        if (!roomId || typeof(roomId) !== 'string') return false;
        const room = await prismaClient.room.findFirst({ where: { linkId: roomId } });
        return !!room;
    } catch (error) {
        console.error("Error checking room existence:", error);
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
    console.log('joining room');
    if (!await roomExists(roomId)) {
        const user = getUser(userId);
        if (user) user.ws.send(JSON.stringify({ type: 'roomNotFound' }));
        return;
    }
    const user = getUser(userId);
    if (!user || user.rooms.has(roomId)) return;

    user.rooms.add(roomId);
    console.log(user.rooms);
    broadcastToRoom(roomId, { type: 'joinRoom', payload: { username: user.username } });
    broadcastToRoom(roomId, { type: 'usersList', payload: { participants: getParticipants(roomId) } });
};

const leaveRoom = async (userId: string, roomId: string) => {
    const user = getUser(userId);
    if (!user || !user.rooms.has(roomId)) return;
    user.rooms.delete(roomId);
    broadcastToRoom(roomId, { type: 'leaveRoom', payload: { username: user.username } });
    broadcastToRoom(roomId, { type: 'usersList', payload: { participants: getParticipants(roomId) } });
};

const createShape = async (userId: string, shape: Shape, roomId: string) => {
    if (!await roomExists(roomId)) return;

    broadcastToRoom(roomId, {
        type: 'create',
        payload: { shape }
    });

    shapeOperationQueue.push({
        type: 'create',
        data: {
            id: shape.id,
            roomId,
            userId,
            shape,
        }
    });
    
    processShapeQueue();
};

const updateShape = async (userId: string, shape: Shape, roomId: string) => {
    if (!await roomExists(roomId)) return;

    broadcastToRoom(roomId, {
        type: 'update',
        payload: { shape }
    });

    shapeOperationQueue.push({
        type: 'update',
        data: {
            id: shape.id,
            shape: shape,
        }
    });

    processShapeQueue();
};

const deleteShape = async (userId: string, shapeId: string, roomId: string) => {
    if (!await roomExists(roomId)) return;

    broadcastToRoom(roomId, {
        type: 'delete',
        payload: { shapeId }
    });
    
    shapeOperationQueue.push({
        type: 'delete',
        shapeId: shapeId,
    });
    
    processShapeQueue();
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
