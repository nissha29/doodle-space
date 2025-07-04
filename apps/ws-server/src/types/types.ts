import WebSocket from "ws";

export interface IUser {
  ws: WebSocket,
  userId: string,
  username: string,
  rooms: number[]
}

export enum MessageType {
    joinRoom = "joinRoom",
    leaveRoom = "leaveRoom",
    chat = "chat"
}