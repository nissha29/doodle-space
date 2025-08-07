"use client";
import { APP_URL } from '@/config';
import useSocket from '@/hooks/useSocket';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { Check, Copy, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useParticipantStore } from '@/store/usePaticipantStore';

interface CollaborationPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export function CollaborationPanel({ isVisible, onClose }: CollaborationPanelProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { leaveRoom } = useSocket();
  const pathname = usePathname();
  const roomLink = `${APP_URL}${pathname}`;
  const { participants } = useParticipantStore();

  function getRoomIdFromLink() {
    try {
      const url = new URL(roomLink.trim());
      const parts = url.pathname.split('/').filter(Boolean);
      return parts[parts.length - 1];
    } catch (e) {
      console.error("Invalid URL format:", e);
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="z-10 absolute right-20 bottom-20 sm:right-24 bg-neutral-900/90 bg-opacity-80 backdrop-blur-md p-4 rounded-lg shadow-2xl border border-neutral-800 text-white w-52 sm:w-64 animate-in fade-in duration-200">

      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-neutral-400 transition-colors"
      >
        <div className='cursor-pointer hover:bg-neutral-700 p-1 rounded-lg transition-colors'>
          <X className="w-5 h-5 text-white" />
        </div>
      </button>

      <div className="mb-4">
        <h3 className="font-bold text-lg mb-2">Participants ({participants.length})</h3>
        <div className="flex flex-col gap-1 max-h-32 overflow-y-auto pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {participants.map((user) => (
            <div key={user.id} className="text-neutral-200 py-1 px-2 rounded-md hover:bg-neutral-700 transition-colors">
              {user.name.toUpperCase()}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold text-lg mb-2">Invite Others</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={roomLink}
            className="bg-neutral-900 border border-neutral-800 rounded-md p-2 text-neutral-200 w-32 sm:w-44"
          />
          <button
            onClick={copyToClipboard}
            className="w-10 flex justify-center items-center bg-white text-black rounded-md sm:w-full py-2.5 text-xl hover:cursor-pointer disabled:cursor-not-allowed"
          >
            {isCopied ? <Check className="w-4 h-4 text-green-700" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        onClick={() => {
          const roomId = getRoomIdFromLink();
          if (roomId) {
            leaveRoom(roomId);
          } else {
            toast.error("Invalid room link. Please check the format.");
          }
        }}
        className="w-full bg-rose-400 hover:bg-rose-500 transition-colors text-white py-2 px-4 rounded-lg hover:cursor-pointer"
      >
        Leave Room
      </button>
    </div>
  );
}