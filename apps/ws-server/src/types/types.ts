import WebSocket from "ws";

export interface IUser {
  ws: WebSocket,
  userId: string,
  username: string,
  rooms: string[]
}

export enum MessageType {
    joinRoom = "joinRoom",
    leaveRoom = "leaveRoom",
    create = "create",
    update = "update",
    delete = "delete",
}