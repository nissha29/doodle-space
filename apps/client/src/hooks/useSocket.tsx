"use client";

import { WS_URL } from "@/config";
import { useShapeStore } from "@/store/useShapeStore";
import { Shape } from "@repo/common/types";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

let wsInstance: WebSocket | null = null;

export default function useSocket() {
  const [loading, setLoading] = useState(false);
  const setShapes = useShapeStore((s) => s.setShapes);
  const socket = useRef(wsInstance);
  const router = useRouter();

  function connect() {
    if (wsInstance && wsInstance.readyState !== WebSocket.CLOSED) {
      socket.current = wsInstance;
      return wsInstance;
    }

    const wsUrl = `${WS_URL}?token=${localStorage.getItem('token')}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connection established');
    }

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      wsInstance = null;
    };

    ws.onerror = () => {
      toast.error('Error');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const type = data.type;

      switch (type) {
        case 'joinRoom':
          console.log(`User joined room: ${data.payload.roomId}`);
          break;
        case 'leaveRoom':
          console.log(`User left room: ${data.payload.roomId}`);
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
          console.error('Unknown message type received');
          return;
      }
    };

    socket.current = ws;
    wsInstance = ws;
    return ws;
  }

  function sendMessage(type: string, payload: any) {
    if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type, payload });
      wsInstance.send(message);
      return true;
    }
    return false;
  }

  function joinRoom(roomId: string) {
    setLoading(true);
    const ws = connect();
    const type = 'joinRoom';
    const payload = { roomId: roomId };

    if (ws?.readyState === WebSocket.OPEN) {
      sendMessage(type, payload);
    } else {
      ws?.addEventListener('open', () => {
        sendMessage(type, payload);
      });
    }
    router.push(`/canvas/room/${roomId}`)
    setLoading(false);
  }

  function createShape(roomId: string, shape: Shape) {
    const type = 'create';
    const payload = { roomId, shape };

    if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
      if (wsInstance?.readyState === WebSocket.OPEN) {
        sendMessage(type, payload);
      } else {
        wsInstance?.addEventListener('open', () => {
          sendMessage(type, payload);
        });
      }
    }
  }

  function updateShape(roomId: string, shape: Shape) {
    const type = 'update';
    const payload = { roomId, shape };

    if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
      if (wsInstance?.readyState === WebSocket.OPEN) {
        sendMessage(type, payload);
      } else {
        wsInstance?.addEventListener('open', () => {
          sendMessage(type, payload);
        });
      }
    }
  }

  function deleteShape(roomId: string, shape: Shape) {
    const type = 'delete';
    const payload = { roomId, shapeId: shape.id };

    if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
      if (wsInstance?.readyState === WebSocket.OPEN) {
        sendMessage(type, payload);
      } else {
        wsInstance?.addEventListener('open', () => {
          sendMessage(type, payload);
        });
      }
    }
  }

  function leaveRoom(roomId: string) {
    const type = 'leaveRoom';
    const payload = { roomId };

    if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
      sendMessage(type, payload);
      wsInstance.close();
      wsInstance = null;
    }
  }

  return {
    connect,
    loading,
    sendMessage,
    joinRoom,
    createShape,
    updateShape,
    deleteShape,
    leaveRoom,
  };
}