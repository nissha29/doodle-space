"use client";

import { SelectTool } from "@/components/canvas/selectTool";
import { useActiveStore } from "@/store/useActiveStore";
import { Action } from "@/types/types";
import { cursorStyle } from "@/utils/cursorStyle";
import { getDrawable } from "@/utils/getDrawable";
import { makeShape } from "@/utils/makeShape";
import isPointInShape from "@/utils/ShapeHitTest";
import { Dimension, Shape } from "@repo/common/types";
import { useEffect, useRef, useState } from "react";
import rough from "roughjs";

const generator = rough.generator();

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [action, setAction] = useState<Action>("none");
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [previewShape, setPreviewShape] = useState<Shape | null>(null);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState<number | null>(
    null
  );
  const [dragOffset, setDragOffset] = useState<{
    dx: number;
    dy: number;
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

  function handleMouseDownOnSelect(point: any) {
    const index = shapes.findIndex((shape) => isPointInShape(point, shape));

    if (index !== -1) {
      const shape = shapes[index];
      const shapeStart = shape.dimension[0];
      setSelectedShapeIndex(index);
      setDragOffset({
        dx: point.x - shapeStart.x,
        dy: point.y - shapeStart.y,
      });
      start;
      setAction("move");
    }
  }

  function handleMouseMovementOnMove(mouse: Dimension) {
    setShapes((prev: Shape[]) =>
      prev.map((shape, index) => {
        if (index === selectedShapeIndex) {
          const dim0 = shape.dimension[0];
          const dim1 = shape.dimension[1];

          const rel = {
            x: dim1.x - dim0.x,
            y: dim1.y - dim0.y,
          };
          const start: Dimension = {
            x: mouse.x - dragOffset!.dx,
            y: mouse.y - dragOffset!.dy,
          };
          const end: Dimension = {
            x: start.x + rel.x,
            y: start.y + rel.y,
          };
          return makeShape(shape.type, start, end)!;
        }
        return shape;
      })
    );
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const cords = getRelativeCoords(event);

    if (activeTool === "select") {
      handleMouseDownOnSelect(cords);
    } else {
      setAction("draw");
      setStart(cords);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const cords = getRelativeCoords(event);

    if (action === "draw") {
      const shape = makeShape(activeTool, start, cords);
      if (!shape) return;
      setPreviewShape(shape);
    } else if (action === "move" && selectedShapeIndex !== null && dragOffset) {
      handleMouseMovementOnMove(cords);
    }
  };

  const handleMouseUp = () => {
    if (action === "draw") {
      if (previewShape) setShapes((prev) => [...prev, previewShape]);
    } else if (action === "move") {
      setSelectedShapeIndex(null);
    }
    setPreviewShape(null);
    setAction("none");
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
