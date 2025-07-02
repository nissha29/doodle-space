import { WebSocketServer } from 'ws';
import { authUser } from './auth/auth.js';
import { addNewConnection, joinRoom, leaveRoom, sendChatToRoom } from './users.js';
import { MessageType } from './types/types.js';
const wss = new WebSocketServer({ port: 8080 });
import { prismaClient } from '@repo/prisma/client';

wss.on('connection', async function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || '';

  const userId = authUser(token);
  if(! userId){
    ws.close();
    return;
  }

  const user = await prismaClient.user.findFirst({
    where: { id: userId }
  })
  if(! user){
    ws.close();
    return;
  }
  
  addNewConnection(ws, userId, user?.name);

  ws.on('message', function message(data) {
    const parsedData = JSON.parse(data as unknown as string);
  
    switch (parsedData.type){
      
      case MessageType.joinRoom: 
        joinRoom(userId, parsedData.roomId);
        break;

      case MessageType.leaveRoom: 
        leaveRoom(userId, parsedData.roomId);
        break;

      case MessageType.chat:
        sendChatToRoom(parsedData.message, parsedData.roomId);
        break;

      default:
        console.error('Unknown message type received');
    }
  });
});




