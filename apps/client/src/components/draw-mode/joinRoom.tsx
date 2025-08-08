import Button from "../forms/button";
import Input from "../forms/input";
import { X } from "lucide-react";
import useSocket from "@/hooks/useSocket";
import { useState } from "react";
import toast from "react-hot-toast";
import useSessionMode from "@/hooks/useSessionMode";

export default function JoinRoom({ setJoinRoom }: any) {
  const [link, setLink] = useState("");
  const { mode, roomId } = useSessionMode();
  const { joinRoom } = useSocket();

  function getRoomIdFromLink() {
    try {
      const url = new URL(link.trim());
      const parts = url.pathname.split('/').filter(Boolean);
      return parts[parts.length - 1];
    } catch (e) {
      console.error("Invalid URL format:", e);
    }
  }

  return (
    <div
      className="fixed inset-0 w-full h-full flex justify-center items-center z-50 bg-black/50 backdrop-blur-sm"
      onClick={() => setJoinRoom(false)}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <div className="border border-neutral-800 p-4 w-72 sm:p-6 sm:w-96 h-72 flex flex-col gap-10 rounded-2xl bg-neutral-900/80 backdrop-blur-md shadow-2xl">
          <div className="flex justify-between items-center">
            <div className="text-3xl text-white">Join Room</div>
            <div
              onClick={() => setJoinRoom(false)}
              className="cursor-pointer hover:bg-neutral-700 p-2 rounded-lg transition-colors"
            >
              <X className="text-white" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Input
              label="Room Link"
              placeholder="Enter Room Link"
              className=""
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <Button className={`sm:w-full`} onClick={() => {
              const roomId = getRoomIdFromLink();
              if (roomId) {
                joinRoom(roomId);
              } else {
                toast.error("Invalid room link. Please check the format.");
              }
            }}>
              Join Room
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
