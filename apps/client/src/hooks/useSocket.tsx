"use client";

import { WS_URL } from "@/config";
import { useShapeStore } from "@/store/useShapeStore";
import { Shape } from "@repo/common/types";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";

let wsInstance: WebSocket | null = null;
let messageQueue: string[] = []; // Queue for messages to be sent upon connection

export default function useSocket() {
  const [isConnected, setIsConnected] = useState(wsInstance?.readyState === WebSocket.OPEN);
  const setShapes = useShapeStore((s) => s.setShapes);
  const router = useRouter();
  const pathname = usePathname();
  const currentRoomRef = useRef<string | null>(null);
  const [loading, setLoading] = useState(false);

  const connect = useCallback(() => {
    if (wsInstance && wsInstance.readyState !== WebSocket.CLOSED) {
      return wsInstance;
    }

    // Clear queue on new connection attempt
    messageQueue = [];

    const wsUrl = `${WS_URL}?token=${localStorage.getItem('token')}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
      // Process any messages that were queued while connecting
      messageQueue.forEach((message) => ws.send(message));
      messageQueue = []; // Clear the queue
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
      wsInstance = null;
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('WebSocket connection error.');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const type = data.type;

        switch (type) {
          case 'joinRoom':
            toast.success(data.message);
            console.log(`User joined room: ${data.roomId}`);
            break;
          case 'create':
            setShapes(prev => [...prev, data.shape]);
            break;
          case 'update':
            setShapes(prev =>
              prev.map(shape => (shape.id === data.shape.id ? data.shape : shape))
            );
            break;
          case 'delete':
            setShapes(prev => prev.filter(shape => shape.id !== data.shapeId));
            break;
          default:
            console.error('Unknown message type received:', data);
        }
      } catch (e) {
        console.error("Failed to parse message:", e);
      }
    };

    wsInstance = ws;
    return ws;
  }, [setShapes]);

  // Connect on initial hook mount
  useEffect(() => {
    connect();
  }, [connect]);


  const sendMessage = (type: string, payload: any) => {
    const message = JSON.stringify({ type, payload });
    if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
      wsInstance.send(message);
    } else {
      // If the socket is not open, queue the message
      console.log('Socket not open, queueing message:', message);
      messageQueue.push(message);
      // Ensure a connection is attempted if not already in progress
      if (!wsInstance || wsInstance.readyState === WebSocket.CLOSED) {
        connect();
      }
    }
  };

  const joinRoom = (roomId: string) => {
    setLoading(true);
    if (currentRoomRef.current === roomId) return;
    currentRoomRef.current = roomId;

    sendMessage('joinRoom', { roomId });
    if (pathname !== `/canvas/room/${roomId}`) {
      router.push(`/canvas/room/${roomId}`);
    }
    setLoading(false);
  };
  
  const createShape = (roomId: string, shape: Shape) => {
    sendMessage('create', { roomId, shape });
  };
  
  const updateShape = (roomId: string, shape: Shape) => {
    sendMessage('update', { roomId, shape });
  };
  
  const deleteShape = (roomId: string, shape: Shape) => {
    sendMessage('delete', { roomId, shapeId: shape.id });
  };

  const leaveRoom = (roomId: string) => {
      sendMessage('leaveRoom', { roomId });
      if (wsInstance) {
          wsInstance.close();
      }
      router.push('/draw-mode')
  };

  return {
    isConnected,
    joinRoom,
    createShape,
    updateShape,
    deleteShape,
    leaveRoom,
    loading
  };
}
