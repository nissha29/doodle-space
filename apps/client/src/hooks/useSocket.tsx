"use client";

import { WS_URL } from "@/config";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

let websocketInstance: WebSocket | null = null;

export default function useWebSocket() {
  const [loading, setLoading] = useState(false);
  const socket = useRef(websocketInstance);
  const router = useRouter();

  function connect() {
    if (websocketInstance && websocketInstance.readyState !== WebSocket.CLOSED) {
      socket.current = websocketInstance;
      return websocketInstance;
    }

    const wsUrl = `${WS_URL}?token=${localStorage.getItem('token')}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connection established');
    }

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      websocketInstance = null;
    };

    ws.onerror = () => {
      toast.error('Error');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const type = data.type;

      if (type === 'joinRoom') {
        toast.success(`Room joined successfully`);
      }
      if (type === 'leaveRoom') {
        toast.success(`Room left successfully`);
      }
      if (type === 'chat') {
      }
    };

    socket.current = ws;
    websocketInstance = ws;
    return ws;
  }

  function sendMessage(type: string, payload: any) {
    if (websocketInstance && websocketInstance.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type, payload });
      websocketInstance.send(message);
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

  function leaveRoom() {
    if (websocketInstance && websocketInstance.readyState === WebSocket.OPEN) {
      sendMessage('leaveRoom', {});
      websocketInstance.close();
      websocketInstance = null;
    }
  }

  return {
    connect,
    loading,
    sendMessage,
    joinRoom,
    leaveRoom,
  };
}