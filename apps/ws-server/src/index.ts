import { WebSocketServer } from 'ws';
import { authUser } from './auth/auth.js';
import { joinRoom, leaveRoom, createShape, updateShape, deleteShape, addConnection, removeConnection, getUser } from './users.js';
import { MessageType } from './types/types.js';
const wss = new WebSocketServer({ port: 8080 });
import { prismaClient } from '@repo/prisma/client';

wss.on('connection', async function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }
  console.log(url);

  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || '';
  const roomId = queryParams.get('roomId') || null;

  const userId = authUser(token);
  if (!userId) {
    ws.close();
    return;
  }
  const user = await prismaClient.user.findFirst({
    where: { id: userId }
  })
  if (!user) {
    ws.close();
    return;
  }

  console.log("roomId - " + roomId);

  addConnection(ws, userId, user?.name);
  console.log(`New connection established for user: ${user.name} with ID: ${userId}`);

  if(roomId){
    console.log('join');
    joinRoom(userId, roomId);
  }

  ws.on('close', () => {
    const user = getUser(userId); 
    if (user) {
      user.rooms.forEach((roomId: string) => {
        leaveRoom(userId, roomId); 
      });
    }
    removeConnection(userId);
  })

  ws.on('message', function message(data) {
    try {
      console.log('RAW MESSAGE:', data);
      const parsedData = JSON.parse(data as unknown as string);
      console.log(parsedData);

      switch (parsedData.type) {

        case MessageType.joinRoom:
          console.log('join message receiving')
          joinRoom(userId, parsedData.payload.roomId);
          break;

        case MessageType.leaveRoom:
          leaveRoom(userId, parsedData.payload.roomId);
          break;

        case MessageType.create:
          console.log('create message receiving')
          createShape(userId, parsedData.payload.shape, parsedData.payload.roomId);
          break;

        case MessageType.update:
          console.log('update message receiving');
          updateShape(userId, parsedData.payload.shape, parsedData.payload.roomId);
          break;

        case MessageType.delete:
          console.log('delete message receiving');
          deleteShape(userId, parsedData.payload.shapeId, parsedData.payload.roomId);
          break;

        default:
          console.error('Unknown message type received');
      }
    } catch (error) {
      console.log(`Incorrect payload, ${error}`);
    }
  });
});




