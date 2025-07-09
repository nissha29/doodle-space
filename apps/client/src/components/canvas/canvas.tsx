"use client";

import canvasInit from "@/canvasKit";
import useLoadShapes from "@/hooks/useLoadShapes";
import useSocket from "@/hooks/useSocket";
import { useShapesStore } from "@/store/useShapesStore";
import { useEffect, useRef } from "react";

export default function Canvas({ roomId }: { roomId: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { socket } = useSocket();
  const shapesStore = useShapesStore();

  const { isRoom } = useLoadShapes(roomId);

  useEffect(() => {
    if (canvasRef.current && isRoom) {
      canvasInit({ canvas: canvasRef.current, roomId: roomId, shapesStore });
    }
  }, [socket, roomId, canvasRef, isRoom]);

  if (!socket) {
    return <div className="text-white">Connecting to ws server...</div>;
  }

  if (isRoom === null) {
    return <div>Loading Room....</div>;
  }

  if (isRoom === false) {
    return <div>No Room found with this id</div>;
  }

  return (
    <div className="">
      <canvas ref={canvasRef} width={1910} height={900}></canvas>
    </div>
  );
}
