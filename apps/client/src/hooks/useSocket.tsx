import { WS_URL } from "@/config";
import { useEffect, useState } from "react";

export default function useSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      console.log("no token");
      setSocket(null);
      return;
    }

    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      console.log("connected");
      setSocket(ws);
    };
  }, []);
  return { socket };
}
