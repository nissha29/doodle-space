"use client";

import ProtectedRoute from "@/components/guards/ProtectedRoute";
import SelectMode from "@/components/draw-mode/selectMode";
import { useUserStore } from "@/store/useUserStore";
import { useState } from "react";
import JoinRoom from "@/components/draw-mode/joinRoom";
import CreateRoom from "@/components/draw-mode/createRoom";

export default function () {
  const user = useUserStore((s) => s.user);
  const [joinRoom, setJoinRoom] = useState(false);
  const [createRoom, setCreateRoom] = useState(false);

  return (
    <ProtectedRoute>
      <div className="px-5 lg:px-10 py-6 w-full h-full">
        <div className="flex justify-between items-center">
          <div className="text-2xl sm:text-3xl">
            ძထძℓ౿
            <span className="px-1.5 py-0.5 rounded-xl text-cyan-400">
              ᦓραсꫀ
            </span>
          </div>
          <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full text-black text-2xl hover:cursor-pointer hover:scale-105">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex justify-center items-center mt-28 flex-col">
          <div className="flex justify-center items-center">
            <div className="text-2xl sm:text-3xl font-semibold">ძƦ⩜Ꮤ, ძထძℓ౿, ძ౿ᦓℹ𝔤ᥒ</div>
          </div>
          <div className="flex flex-col border border-neutral-700 rounded-2xl mt-6 p-6 sm:p-12 bg-neutral-900/20">
            <div className="text-2xl sm:text-3xl text-white mb-8">
              Select Mode
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <SelectMode type="draw" href="/canvas"/>
              <SelectMode type="join" onClick={() => setJoinRoom(true)}/>
              <SelectMode type="create" onClick={() => setCreateRoom(true)}/>
              {/* <SelectMode type="play" href="/play"/> */}
            </div>
          </div>
        </div>
        {joinRoom && <JoinRoom setJoinRoom={setJoinRoom}/>}
        {createRoom && <CreateRoom setCreateRoom={setCreateRoom}/>}
      </div>
    </ProtectedRoute>
  );
}
