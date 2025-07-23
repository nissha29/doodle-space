"use client";

import { SelectTool } from "@/components/canvas/selectTool";
import { useActiveStore } from "@/store/useActiveStore";
import { Action, TextInput } from "@/types/types";
import {
  getBoundingBox,
  drawBoundingBoxAndHandlers,
} from "@/utils/boundingBox";
import { cursorStyle } from "@/utils/cursorStyle";
import { getDrawable, getText } from "@/utils/getDrawable";
import {
  handleMouseMovementOnMove,
  handleMouseMovementOnResize,
  makeShape,
} from "@/utils/mouseListeners/mouseMove";
import {
  checkIsCursorInShape,
  checkIsCursorOnHandlers,
  getShapeIndexOnPrecisePoint,
} from "@/utils/mouseListeners/mouseDown";
import { Dimension, Shape } from "@repo/common/types";
import React, { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import { InputText } from "./InputText";
import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke } from "../../utils/getSvgPathFromStroke";

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
  const [resizeHandlerIndex, setResizeHandlerIndex] = useState<number | null>(
    null
  );
  const [dragOffset, setDragOffset] = useState<{
    dx: number;
    dy: number;
  } | null>(null);
  const activeTool = useActiveStore((s) => s.activeTool);
  const [textInput, setTextInput] = useState<TextInput | null>(null);
  const [currentPoints, setCurrentPoints] = useState<Dimension[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);

    shapes.forEach((shape) => {
      if (shape.type === "pencil") {
        const stroke = getStroke(shape.points, {
          size: 3,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
        });

        const path = getSvgPathFromStroke(stroke);

        ctx.fillStyle = "#0ff";
        ctx.fill(new Path2D(path));

        if (currentPoints.length > 0) {
          const stroke = getStroke(currentPoints, {
            size: 3,
            thinning: 0.5,
            smoothing: 0.5,
            streamline: 0.5,
          });
          const path = getSvgPathFromStroke(stroke);
          ctx.fillStyle = "#0ff";
          ctx.fill(new Path2D(path));
        }
      } else if (shape.type === "text") {
        getText(ctx, shape);
      } else {
        const draw = getDrawable(shape, generator);
        if (draw) {
          if (Array.isArray(draw)) {
            draw.forEach((d) => roughCanvas.draw(d));
          } else {
            roughCanvas.draw(draw);
          }
        }
      }
    });

    if (previewShape) {
      if (previewShape.type === "text") {
        getText(ctx, previewShape);
      } else {
        const draw = getDrawable(previewShape, generator);
        if (draw) {
          if (Array.isArray(draw)) {
            draw.forEach((d) => roughCanvas.draw(d));
          } else {
            roughCanvas.draw(draw);
          }
        }
      }
    }

    if (
      action === "draw" &&
      activeTool === "pencil" &&
      currentPoints.length > 0
    ) {
      const stroke = getStroke(currentPoints, {
        size: 3,
        thinning: 0.5,
        smoothing: 0.5,
        streamline: 0.5,
      });

      const path = getSvgPathFromStroke(stroke);

      ctx.fillStyle = "#0ff";
      ctx.fill(new Path2D(path));

      if (currentPoints.length > 0) {
        const stroke = getStroke(currentPoints, {
          size: 3,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
        });
        const path = getSvgPathFromStroke(stroke);
        ctx.fillStyle = "#0ff";
        ctx.fill(new Path2D(path));
      }
    }

    if (activeTool === "select" && selectedShapeIndex !== null) {
      const shape = shapes[selectedShapeIndex];
      const box = getBoundingBox(shape, ctx);
      if (!box) return;
      drawBoundingBoxAndHandlers(generator, roughCanvas, box);
    }
  }, [shapes, previewShape, activeTool, selectedShapeIndex, currentPoints]);

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
    const cords = getRelativeCoords(event);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (activeTool === "select") {
      const handlerIndex = checkIsCursorOnHandlers(
        cords,
        selectedShapeIndex,
        shapes,
        ctx
      );

      if (typeof handlerIndex === "number" && selectedShapeIndex !== null) {
        setAction("resize");
        setResizeHandlerIndex(handlerIndex);
      } else {
        const index = checkIsCursorInShape(
          cords,
          shapes,
          setSelectedShapeIndex,
          setDragOffset,
          ctx
        );
        if (index !== -1) {
          setAction("move");
        }
      }
    } else if (activeTool === "eraser") {
      setAction("erase");
    } else if (activeTool === "pencil") {
      setAction("draw");
      setCurrentPoints([cords]);
    } else {
      setAction("draw");
      setStart(cords);
      setSelectedShapeIndex(null);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const cords = getRelativeCoords(event);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (action === "draw" && activeTool === "pencil") {
      setCurrentPoints((prev) => [...prev, cords]);
    } else if (action === "draw") {
      const shape = makeShape(activeTool, start, cords);
      if (!shape) return;
      setPreviewShape(shape);
    } else if (action === "move" && selectedShapeIndex !== null && dragOffset) {
      console.log(action);
      handleMouseMovementOnMove(
        cords,
        setShapes,
        selectedShapeIndex,
        dragOffset
      );
    } else if (action === "resize" && selectedShapeIndex != null) {
      handleMouseMovementOnResize(
        cords,
        shapes,
        setShapes,
        selectedShapeIndex,
        resizeHandlerIndex,
        ctx
      );
    } else if (action === "erase") {
      const hitIndex = getShapeIndexOnPrecisePoint(cords, shapes, ctx);
      console.log(hitIndex);
      if (hitIndex !== -1) {
        setShapes((prev) => prev.filter((_shape, index) => index !== hitIndex));
      }
    }
  };

  const handleMouseUp = () => {
    if (
      action === "draw" &&
      activeTool === "pencil" &&
      currentPoints.length > 0
    ) {
      const freeDraw: Shape = { type: "pencil", points: currentPoints };
      setShapes((prev) => [...prev, freeDraw]);
      setCurrentPoints([]);
    } else if (action === "draw") {
      if (previewShape) setShapes((prev) => [...prev, previewShape]);
    } else if (action === "move") {
      setSelectedShapeIndex(null);
    }
    setPreviewShape(null);
    setAction("none");
  };

  const handleMouseClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const cords = getRelativeCoords(event);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (activeTool === "select") {
      checkIsCursorInShape(
        cords,
        shapes,
        setSelectedShapeIndex,
        setDragOffset,
        ctx
      );
    } else if (activeTool === "text") {
      setTextInput({ cords, value: "" });
    } else if (activeTool !== "eraser") {
      setSelectedShapeIndex(null);
    }
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={1920}
        height={910}
        className="text-white"
        onPointerDown={handleMouseDown}
        onPointerMove={handleMouseMove}
        onPointerUp={handleMouseUp}
        onClick={handleMouseClick}
      ></canvas>

      <InputText
        textInput={textInput}
        setShapes={setShapes}
        setTextInput={setTextInput}
        shapes={shapes}
      />

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
