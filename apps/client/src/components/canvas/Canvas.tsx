"use client";

import { SelectTool } from "@/components/canvas/selectTool";
import { useActiveStore } from "@/store/useActiveStore";
import { Action, TextInput } from "@/types/types";
import {
  getBoundingBox,
  drawBoundingBoxAndHandlers,
} from "@/utils/boundingBox";
import { cursorStyle } from "@/utils/cursorStyle";
import { freeDraw, getDrawable, getText } from "@/utils/getDrawable";
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
import useUndoRedo from "@/hooks/useUndoRedo";
import { useCurrentCanvasStore } from "@/store/useCurrentCanvasStore";
import { useIndexStore } from "@/store/useIndexStore";
import { Zoom } from "./Zoom";
import { UndoRedo } from "./UndoRedo";
import { useZoom } from "@/hooks/useZoom";

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
  const currentCanvas = useCurrentCanvasStore((s) => s.currentCanvas);
  const index = useIndexStore((s) => s.index);
  const { addAction, undo, redo } = useUndoRedo();
  const { zoom, zoomIn, zoomOut, resetZoom } = useZoom();
  const [panOffset, setPanOffset] = useState<Dimension>({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState<Dimension | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const primary = e.ctrlKey || e.metaKey;
      if (primary && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (primary && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);

    ctx.save();

    shapes.forEach((shape) => {
      if (shape.type === "pencil") {
        freeDraw(ctx, shape.points, panOffset);

        if (currentPoints.length > 0) {
          freeDraw(ctx, shape.points, panOffset);
        }
      } else if (shape.type === "text") {
        getText(ctx, shape, panOffset);
      } else {
        const draw = getDrawable(shape, generator, panOffset);
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
        getText(ctx, previewShape, panOffset);
      } else {
        const draw = getDrawable(previewShape, generator, panOffset);
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
      freeDraw(ctx, currentPoints, panOffset);

      if (currentPoints.length > 0) {
        freeDraw(ctx, currentPoints, panOffset);
      }
    }

    if (activeTool === "select" && selectedShapeIndex !== null) {
      const shape = shapes[selectedShapeIndex];
      const box = getBoundingBox(shape, ctx);
      if (!box) return;
      drawBoundingBoxAndHandlers(generator, roughCanvas, box, panOffset);
    }

    ctx.restore();
  }, [
    shapes,
    previewShape,
    activeTool,
    selectedShapeIndex,
    currentPoints,
    panOffset,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.cursor = cursorStyle[activeTool];
  }, [activeTool]);

  useEffect(() => {
    setShapes(currentCanvas[index] || []);
  }, [currentCanvas, index]);

  function getRelativeCoords(event: any) {
    const rect = event.target.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) + panOffset.x,
      y: (event.clientY - rect.top) + panOffset.y,
    };
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const cords = getRelativeCoords(event);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (activeTool === "pan") {
      setPanStart({ x: event.clientX, y: event.clientY });
      setAction("pan");
    } else if (activeTool === "select") {
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

    if (action === "pan" && panStart) {
      const dx = event.clientX - panStart.x;
      const dy = event.clientY - panStart.y;
      setPanOffset((prev) => ({
        x: prev.x - dx,
        y: prev.y - dy,
      }));
      setPanStart({ x: event.clientX, y: event.clientY });
    } else if (action === "draw" && activeTool === "pencil") {
      setCurrentPoints((prev) => [...prev, cords]);
    } else if (action === "draw") {
      const shape = makeShape(activeTool, start, cords);
      if (!shape) return;
      setPreviewShape(shape);
    } else if (action === "move" && selectedShapeIndex !== null && dragOffset) {
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
    if (action === "pan") {
      setPanStart(null);
      setAction("none");
    } else if (
      action === "draw" &&
      activeTool === "pencil" &&
      currentPoints.length > 0
    ) {
      const freeDraw: Shape = { type: "pencil", points: currentPoints };
      addAction([...shapes, freeDraw]);
      setShapes((prev) => [...prev, freeDraw]);
      setCurrentPoints([]);
    } else if (action === "draw") {
      if (previewShape) {
        addAction([...shapes, previewShape]);
        setShapes((prev) => [...prev, previewShape]);
      }
    } else if (action === "move") {
      addAction(shapes);
      setSelectedShapeIndex(null);
    } else if (action === "resize") {
      addAction(shapes);
    } else if (action === "erase") {
      addAction(shapes);
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
        panOffset={panOffset}
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
      <div>
        {/* <Zoom zoom={zoom} zoomIn={zoomIn} zoomOut={zoomOut} resetZoom={resetZoom}/> */}
        <UndoRedo />
      </div>
    </div>
  );
}
