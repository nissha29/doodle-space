"use client";

import { WS_URL } from "@/config";
import { useParticipantStore } from "@/store/usePaticipantStore";
import { useShapeStore } from "@/store/useShapeStore";
import { useSocketStatusStore } from "@/store/useSocketStatusStore";
import { SocketStatus } from "@/types/types";
import { Shape } from "@repo/common/types";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import useSessionMode from "./useSessionMode";

let wsInstance: WebSocket | null = null;
let connectionQueue: (() => void)[] = [];
let isConnecting = false;

const connect = (
  roomId: string | null,
  setSocketStatus: (status: SocketStatus) => void
) => {
  const token = localStorage.getItem('token');

  if (!token || !roomId) return;
  if (wsInstance || isConnecting) {
    return;
  }
  isConnecting = true;
  setSocketStatus(SocketStatus.connecting);

  let wsUrl = `${WS_URL}?token=${token}`;

  if (roomId) {
    wsUrl += `&roomId=${roomId}`;
  }

  const ws = new WebSocket(wsUrl);
  wsInstance = ws;

  ws.onopen = () => {
    console.log('WebSocket connection established');
    isConnecting = false;
    setSocketStatus(SocketStatus.connected);
    connectionQueue.forEach(action => action());
    connectionQueue = [];
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
    isConnecting = false;
    wsInstance = null;
    setSocketStatus(SocketStatus.disconnected);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    isConnecting = false;
    wsInstance = null;
    setSocketStatus(SocketStatus.disconnected);
    toast.error('WebSocket connection error.');
  };

  return ws;
};

export default function useSocket() {
  const { setShapes } = useShapeStore();
  const router = useRouter();
  const { setParticipants } = useParticipantStore();
  const { socketStatus, setSocketStatus } = useSocketStatusStore();
  const { roomId } = useSessionMode();
  const pathname = usePathname();

  useEffect(() => {
    const ws = connect(roomId, setSocketStatus);

    if (ws) {

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const { type, payload } = data;

          switch (type) {
            case 'roomNotFound':
              toast.error('Room not found');
              router.push('/room-not-found');
              break;
            case 'joinRoom':
              toast.success(`${payload.username} has joined room`);
              if (pathname !== `/canvas/room/${roomId}`) {
                router.push(`/canvas/room/${roomId}`);
              }
              break;
            case 'leaveRoom':
              toast.error(`${payload.username} has left the room`);
              break;
            case 'usersList':
              setParticipants(payload.participants);
              break;
            case 'create':
              setShapes(prev => [...prev, payload.shape]);
              break;
            case 'update':
              setShapes(prev => prev.map(s => s.id === payload.shape.id ? payload.shape : s));
              break;
            case 'delete':
              setShapes(prev => prev.filter(s => s.id !== payload.shapeId));
              break;
            default:
              console.warn('Unknown message type:', type);
          }
        } catch (e) {
          console.error("Failed to parse message:", e);
        }
      };
    }
  }, [setParticipants, setShapes, setSocketStatus]);

  const sendMessage = (type: string, payload: any) => {
    const action = () => {
      if (wsInstance?.readyState === WebSocket.OPEN) {
        console.log('sending msg');
        wsInstance.send(JSON.stringify({ type, payload }));
      }
    };

    if (wsInstance?.readyState === WebSocket.OPEN) {
      console.log('sending join msg here');
      action();
    } else {
      console.log('pushing join msg in queue')
      connectionQueue.push(action);
      if (!wsInstance && !isConnecting) {
        connect(roomId, setSocketStatus);
      }
    }
  };

  const joinRoom = useCallback((roomId: string) => {
    console.log('inside join room');
    sendMessage('joinRoom', { roomId });

    if (pathname !== `/canvas/room/${roomId}`) {
      router.push(`/canvas/room/${roomId}`);
    }
  }, [pathname, router]);

  const leaveRoom = useCallback((roomId: string) => {
    sendMessage('leaveRoom', { roomId });
    wsInstance?.close();
    router.push('/draw-mode');
  }, [router]);

  const createShape = useCallback((roomId: string, shape: Shape) => {
    sendMessage('create', { roomId, shape });
  }, []);

  const updateShape = useCallback((roomId: string, shape: Shape) => {
    sendMessage('update', { roomId, shape });
  }, []);

  const deleteShape = useCallback((roomId: string, shapeId: string) => {
    sendMessage('delete', { roomId, shapeId });
  }, []);

  return {
    socketStatus,
    connect,
    joinRoom,
    leaveRoom,
    createShape,
    updateShape,
    deleteShape,
  };
}