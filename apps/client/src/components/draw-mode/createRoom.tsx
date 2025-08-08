import { useState } from "react";
import Button from "../forms/button";
import Input from "../forms/input";
import { X, Copy, Check } from "lucide-react";
import { nanoid } from "nanoid";
import { createRoom } from "@/api/room";
import toast from "react-hot-toast";
import useSocket from "@/hooks/useSocket";
import useSessionMode from "@/hooks/useSessionMode";

export default function CreateRoom({ setCreateRoom }: any) {
  const [roomLink, setRoomLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isRoomCreated, setIsRoomCreated] = useState(false);
  const [loader, setLoader] = useState(false);
  const { mode, roomId } = useSessionMode();
  const { joinRoom } = useSocket();

  const generateRoomLink = async () => {
    try {
      setLoader(true);
      const roomId = nanoid(15);
      const link = `${window.location.origin}/canvas/room/${roomId}`;
      setRoomLink(link);
      const roomData = { linkId: roomId }
      await createRoom(roomData);
      toast.success("Room created successfully! You can now share the link with others.");
      setIsRoomCreated(true);
      setLoader(false);
    } catch (error: any) {
      toast.error(error.message || "Oops! Something went wrong during room creation.");
      setLoader(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div
      className="fixed inset-0 w-full h-full flex justify-center items-center z-50 bg-black/50 backdrop-blur-sm"
      onClick={() => setCreateRoom(false)}
    >
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border border-neutral-800 p-4 w-72 sm:p-6 sm:w-96 min-h-72 flex flex-col gap-6 rounded-2xl bg-neutral-900/90 backdrop-blur-md shadow-2xl">
          <div className="flex justify-between items-center">
            <div className="text-2xl text-white font-semibold">Create New Room</div>
            <div
              onClick={() => setCreateRoom(false)}
              className="cursor-pointer hover:bg-neutral-700 p-2 rounded-lg transition-colors"
            >
              <X className="text-white w-5 h-5" />
            </div>
          </div>

          <div className="flex flex-col gap-4">

            {isRoomCreated ? <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 justify-center items-center">
                  <Input
                    label="Room Link Generated"
                    value={roomLink}
                    readOnly
                    className="flex-1 bg-neutral-800 border-neutral-700 text-neutral-200 w-52 sm:w-72"
                  />
                  <Button
                    onClick={copyToClipboard}
                    className="px-1 py-3 mt-9 bg-neutral-200 hover:bg-neutral-300 border border-neutral-600 flex justify-center items-center"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-green-700" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="text-neutral-400 bg-neutral-800/50 p-3 rounded-lg">
                Share this link with others to invite them to your room.
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    const roomId = roomLink.split('/').pop() || '';
                    joinRoom(roomId);
                  }}
                  className=""
                >
                  Join Room
                </Button>
              </div>
            </div> : <div className="flex flex-col gap-4">
              <p className="text-neutral-300">
                Click the button below to generate a new room link that you can share with others.
              </p>
              <Button onClick={generateRoomLink} className="w-full">
                {loader ? 'Generating Room...' : 'Generate Room Link'}
              </Button>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
}