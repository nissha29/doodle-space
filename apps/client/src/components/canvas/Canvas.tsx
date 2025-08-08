"use client";

import { SelectTool } from "@/components/canvas/selectTool";
import { useActiveStore } from "@/store/useActiveStore";
import { Action, SocketStatus, TextInput } from "@/types/types";
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
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import rough from "roughjs";
import { InputText } from "./InputText";
import useUndoRedo from "@/hooks/useUndoRedo";
import { useCurrentCanvasStore } from "@/store/useCurrentCanvasStore";
import { useIndexStore } from "@/store/useIndexStore";
import { UndoRedo } from "./UndoRedo";
import useSessionMode from "@/hooks/useSessionMode";
import useSocket from "@/hooks/useSocket";
import { v4 as uuidv4 } from 'uuid';
import { useShapeStore } from "@/store/useShapeStore";
import { getExistingShapes } from "@/api/room";
import toast from "react-hot-toast";
import { CollaborationPanel } from "./CollaborationPanel";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";
import Logout from "./Logout";

function getInitialShapes(): Shape[] {
  const rawCanvas = localStorage.getItem('current-canvas');
  const rawIndex = localStorage.getItem('index');
  if (!rawCanvas || !rawIndex) return [];

  try {
    const parsedCanvas = JSON.parse(rawCanvas);
    const parsedIndex = JSON.parse(rawIndex);
    const idx = parsedIndex.state?.index;
    const allCanvases = parsedCanvas.state?.currentCanvas as Shape[][] | undefined;

    if (Array.isArray(allCanvases) && typeof idx === 'number') {
      return allCanvases[idx] ?? [];
    }
  } catch {

  }

  return [];
}


const generator = rough.generator();

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [action, setAction] = useState<Action>("none");
  const [start, setStart] = useState({ x: 0, y: 0 });
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
  const [panOffset, setPanOffset] = useState<Dimension>({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState<Dimension | null>(null);
  const { mode, roomId } = useSessionMode();
  const { createShape, updateShape, deleteShape, socketStatus } = useSocket();
  const shapes = useShapeStore((s) => s.shapes);
  const setShapes = useShapeStore((s) => s.setShapes);
  const [hasMoved, setHasMoved] = useState(false);
  const [showCollabPanel, setShowCollabPanel] = useState(false);
  const router = useRouter();

  useLayoutEffect(() => {
    function resizeCanvas() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = window.devicePixelRatio || 1;
      const w = parent.clientWidth;
      const h = parent.clientHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
      }
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {

    const restoredShapes = async () => {
      if (mode === 'collaborative' && roomId) {
        try {
          const initialShapes = await getExistingShapes(roomId);
          setShapes(initialShapes);
        } catch (error) {
          toast.error("Failed to load existing shapes.");
        }
      } else if (mode === 'solo') {
        const initialShapes = getInitialShapes();
        setShapes(initialShapes);
      }
    }
    restoredShapes();
  }, [mode, roomId]);

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

    shapes.forEach((shape: Shape) => {
      if (!shape) return;

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
    setHasMoved(false);

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
      setHasMoved(true);
      handleMouseMovementOnMove(
        cords,
        setShapes,
        selectedShapeIndex,
        dragOffset
      );
    } else if (action === "resize" && selectedShapeIndex != null) {
      setHasMoved(true);
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
      if (hitIndex !== -1) {
        setShapes((prev: Shape[]) => prev.filter((_shape, index) => index !== hitIndex));
        if (mode === "collaborative" && roomId) {
          const shape = shapes[hitIndex];
          deleteShape(roomId, shape.id);
        }
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
      const freeDraw: Shape = { id: uuidv4(), type: "pencil", points: currentPoints };
      addAction([...shapes, freeDraw]);
      setShapes((prev: Shape[]) => [...prev, freeDraw]);
      setCurrentPoints([]);
      if (mode === "collaborative" && roomId) {
        createShape(roomId, freeDraw);
      }
    } else if (action === "draw") {
      if (previewShape) {
        addAction([...shapes, previewShape]);
        setShapes((prev: Shape[]
        ) => [...prev, previewShape]);
        if (mode === "collaborative" && roomId) {
          createShape(roomId, previewShape);
        }
      }
    } else if (action === "move") {
      if (mode === "collaborative" && roomId && hasMoved) {
        const shape = shapes[selectedShapeIndex!];
        updateShape(roomId, shape);
      }
      addAction(shapes);
    } else if (action === "resize") {
      if (mode === "collaborative" && roomId && hasMoved) {
        const shape = shapes[selectedShapeIndex!];
        updateShape(roomId, shape);
      }
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

  const toggleCollaborationPanel = () => {
    setShowCollabPanel(!showCollabPanel);
  };

  const closeCollaborationPanel = () => {
    setShowCollabPanel(false);
  };

  return (
    <div className="relative overflow-y-hidden w-full h-screen">
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

      <div className="absolute top-6 left-6">
        <div className="text-2xl sm:text-3xl">
          ძထძℓ౿
          <span className="px-1.5 py-0.5 rounded-xl text-cyan-400">ᦓραс౿</span>
        </div>
      </div>
      <div className="fixed top-6 right-6 z-20">
        <SelectTool />
      </div>
      <div>
        {mode === 'solo' ? <UndoRedo /> : <Logout />}
        {mode === 'collaborative' && <div><button
          onClick={toggleCollaborationPanel}
          className="fixed bottom-6 right-6 sm:bottom-6 sm:right-6 bg-neutral-700/60 hover:bg-neutral-800 hover:cursor-pointer text-white tracking-wider p-3 rounded-lg shadow-lg transition-colors flex items-center gap-2"
        >
          <Users className="w-5 h-5" />
          <span className="hidden md:inline">View Participants</span>
        </button>

          <CollaborationPanel
            isVisible={showCollabPanel}
            onClose={closeCollaborationPanel}
          />
        </div>}
      </div>
    </div >
  );
}