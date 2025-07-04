import axios from "axios";
import { BACKEND_URL } from "../../config/config";
import ChatRoom from "../../components/ChatRoom";

const getRoomIdBySlug = async (slug: string) => {
  const response = await axios.get(`${BACKEND_URL}/room/${slug}`, {
    headers: {
      authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjUzZjIzMi0yNzgyLTQ1ZjEtYWU3Zi1jMDE5YWYwNzhkMWUiLCJpYXQiOjE3NTE1MzEwNTgsImV4cCI6MTc1MjM5NTA1OH0._pNAc5oEAF9uOnNhHCL2sClGXc4bfEslLvnF1iPkakc`,
    },
  });
  return response.data.result.roomId;
};

export default async function Room({ params }: any) {
  const param = await params;
  const slug = param.slug;
  if (!slug || typeof slug !== "string") {
    return;
  }
  const roomId: number = await getRoomIdBySlug(slug);
  return <ChatRoom roomId={roomId}/>
}
