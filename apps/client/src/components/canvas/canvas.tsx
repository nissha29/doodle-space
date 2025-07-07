import canvasInit from "@/canvasKit";
import { useEffect, useRef } from "react";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if(canvasRef.current){
        canvasInit(canvasRef.current);
    }
  }, [canvasRef]);

  return (
    <div className="">
      <canvas ref={canvasRef} width={1910} height={900}></canvas>
    </div>
  );
}
