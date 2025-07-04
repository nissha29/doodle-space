"use client";

import { useEffect, useState } from "react";
import useSocket from "../hooks/useSocket";

export default function ChatRoomClient({
  messages,
  id,
}: {
  messages: string[];
  id: number;
}) {
  const { loading, socket } = useSocket();
  const [chats, setChats] = useState(messages);
  const [newText, setNewText] = useState("");

  useEffect(() => {
    if (!socket || loading) {
      return;
    }
    socket.send(
      JSON.stringify({
        type: "joinRoom",
        roomId: id,
      })
    );

    socket.onmessage = (event) => {
      let parsedData;
      try {
        parsedData = JSON.parse(event.data);
      } catch (e) {
        console.error("Failed to parse WebSocket message:", event.data, e);
        return;
      }
      if (parsedData.type === "chat") {
        setChats((c) => [...c, parsedData.message]);
      } else if (parsedData.type === "joinRoom") {
        alert("Room joined successfully");
      }
    };
  }, [socket, loading, id]);

  return (
    <div>
      <div>
        {chats.map((chat, key) => {
          return <div key={key}>{chat}</div>;
        })}
      </div>
      <input
        type="text"
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
      />
      <button
        onClick={() => {
          socket?.send(
            JSON.stringify({
              type: "chat",
              roomId: id,
              message: newText,
            })
          );
          setNewText("");
        }}
      >
        Send Message
      </button>
    </div>
  );
}
