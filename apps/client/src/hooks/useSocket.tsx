import { useSocketStore } from "@/store/useSocketStore";
import { useEffect } from "react";

export default function useSocket(roomId: number) {
  const token = localStorage.getItem("token");
  const socket = useSocketStore((s) => s.socket);
  const connect = useSocketStore((s) => s.connect);

  useEffect(() => {
    if (!token) {
      console.log("no token");
      return;
    }

    connect(roomId, token);
  }, []);
  return { socket };
}
