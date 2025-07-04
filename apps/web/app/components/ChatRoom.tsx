import axios from "axios";
import { BACKEND_URL } from "../config/config";
import ChatRoomClient from "./ChatRoomClient";

const getChats = async (roomId: number) => {
    const url = `${BACKEND_URL}/room/chats/${roomId}`;
    console.log(url)
  const response = await axios.get(`${BACKEND_URL}/room/chats/${roomId}`, {
    headers: {
      authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjUzZjIzMi0yNzgyLTQ1ZjEtYWU3Zi1jMDE5YWYwNzhkMWUiLCJpYXQiOjE3NTE1MzEwNTgsImV4cCI6MTc1MjM5NTA1OH0._pNAc5oEAF9uOnNhHCL2sClGXc4bfEslLvnF1iPkakc`,
    },
  });
  return response.data.result.chats.map((chat: { message: string }) => chat.message);
};

export default async function ChatRoom({ roomId }: { roomId: number }) {
  const chats = await getChats(roomId);
  return <ChatRoomClient messages={chats} id={roomId} />;
}
