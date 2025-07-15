"use client";

import { SelectTool } from "@/components/canvas/selectTool";
import { useActiveStore } from "@/store/useActiveStore";
import { Action } from "@/types/types";
import { cursorStyle } from "@/utils/cursorStyle";
import { getDrawable } from "@/utils/getDrawable";
import { makeShape } from "@/utils/makeShape";
import isPointInShape from "@/utils/ShapeHitTest";
import { Shape } from "@repo/common/types";
import { useEffect, useRef, useState } from "react";
import rough from "roughjs";

const generator = rough.generator();

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [action, setAction] = useState<Action>("none");
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [previewShape, setPreviewShape] = useState<Shape | null>(null);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState<number | null>(null);
  const [lastMousePos, setLastMousePos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const activeTool = useActiveStore((s) => s.activeTool);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);

    shapes.forEach((shape) => {
      const draw = getDrawable(shape, generator);
      if (draw) {
        if (Array.isArray(draw)) {
          draw.forEach((d) => roughCanvas.draw(d));
        } else {
          roughCanvas.draw(draw);
        }
      }
    });

    if (previewShape) {
      const draw = getDrawable(previewShape, generator);
      if (draw) {
        if (Array.isArray(draw)) {
          draw.forEach((d) => roughCanvas.draw(d));
        } else {
          roughCanvas.draw(draw);
        }
      }
    }
  }, [shapes, previewShape]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.cursor = cursorStyle[activeTool];
  }, [activeTool]);

  function getRelativeCoords(event: any) {
    const rect = event.target.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === "select") {
      setAction("move");
      const point = getRelativeCoords(event);
      const index = shapes.findIndex((shape) => isPointInShape(point, shape));
      if (index !== -1) {
        setSelectedShapeIndex(index);
        setLastMousePos(point);
      }
    } else {
      setAction("draw");
      const { clientX, clientY } = event;
      setStart({ x: clientX, y: clientY });
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const end = getRelativeCoords(event);
    if (action === "draw") {
      makeShape(activeTool, start, end, setPreviewShape);
    }
    else if(action === "move" && selectedShapeIndex !== null && lastMousePos){
      const dx = end.x - lastMousePos.x;
      const dy = end.y - lastMousePos.y;
      setShapes((prev: any) => prev.map((shape: Shape, index: number) => {
        index === selectedShapeIndex ? {
          
        } : {

        }
      }))
    }
  };

  const handleMouseUp = () => {
    if (action === "none" || !previewShape) return;
    setAction("none");
    setShapes((prev) => [...prev, previewShape]);
    setPreviewShape(null);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={1920}
        height={910}
        className="text-white"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      ></canvas>
      <div className="absolute top-6 left-10">
        <div className="text-2xl sm:text-3xl">
          ძထძℓꫀ
          <span className="px-1.5 py-0.5 rounded-xl text-cyan-400">ᦓραсꫀ</span>
        </div>
      </div>
      <div className="fixed top-6 right-10 z-20">
        <SelectTool />
      </div>
    </div>
  );
}
