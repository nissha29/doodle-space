import { useEffect, useState } from "react";
import { WS_URL } from "../config/config";

export default function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjUzZjIzMi0yNzgyLTQ1ZjEtYWU3Zi1jMDE5YWYwNzhkMWUiLCJpYXQiOjE3NTE1MzEwNTgsImV4cCI6MTc1MjM5NTA1OH0._pNAc5oEAF9uOnNhHCL2sClGXc4bfEslLvnF1iPkakc`);
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };
  }, []);

  return {
    loading,
    socket,
  };
}
