"use client";

import { getDrawable } from "@/utils/getDrawable";
import { makeShape } from "@/utils/makeShape";
import { Shape } from "@repo/common/types";
import { useEffect, useRef, useState } from "react";
import rough from "roughjs";

const generator = rough.generator();

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [type, setType] = useState("line");
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [previewShape, setPreviewShape] = useState<Shape | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);

    shapes.forEach((shape) => {
      const draw = getDrawable(shape, generator);
      if (draw) roughCanvas.draw(draw);
    });

    if (previewShape) {
      const draw = getDrawable(previewShape, generator);
      if (draw) roughCanvas.draw(draw);
    }
  }, [shapes, previewShape]);

  function getRelativeCoords(event: any) {
    const rect = event.target.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    const { clientX, clientY } = event;
    setStart({ x: clientX, y: clientY });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const end = getRelativeCoords(event);
    makeShape(type, start, end, setPreviewShape);
  };

  const handleMouseUp = () => {
    if (!drawing || !previewShape) return;
    setDrawing(false);
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
      <div className="absolute top-10 left-60 flex justify-center items-start gap-10">
        <label htmlFor="Line" className="">
          Line
        </label>
        <input
          type="radio"
          name="shape"
          onClick={() => setType("line")}
          value={type}
        />
        <label htmlFor="Rectangle" className="">
          Rectangle
        </label>
        <input
          type="radio"
          name="shape"
          onClick={() => setType("rectangle")}
          value={type}
        />
        <label htmlFor="Circle" className="">
          Circle
        </label>
        <input
          type="radio"
          name="shape"
          onClick={() => setType("circle")}
          value={type}
        />
      </div>
    </div>
  );
}
