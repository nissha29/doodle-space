import { Dimension, Shape } from "@repo/common/types";
import { Dispatch, SetStateAction } from "react";
import isPointInShape, { isPointInsideOrOnBoundingBox } from "../ShapeHitTest";
import { getBoundingBox, getHandlerPositions } from "../boundingBox";

export function getShapeIndexWithinBoundingBox(
  cords: Dimension,
  shapes: Shape[],
  ctx: CanvasRenderingContext2D
): number {
  return shapes.findIndex((shape) =>
    isPointInsideOrOnBoundingBox(cords, shape, ctx)
  );
}

export function getShapeIndexOnPrecisePoint(
  cords: Dimension,
  shapes: Shape[],
  ctx?: CanvasRenderingContext2D
): number {
  return shapes.findIndex((shape) =>
    isPointInShape(shape, cords, ctx)
  );
}

export function checkIsCursorInShape(cords: Dimension, shapes: Shape[], setSelectedShapeIndex: Dispatch<SetStateAction<number | null>>, setDragOffset: Dispatch<SetStateAction<{ dx: number, dy: number } | null>>, ctx: CanvasRenderingContext2D) {
  const index = getShapeIndexWithinBoundingBox(cords, shapes, ctx);

  if (index !== -1) {
    const shape = shapes[index];
    if (shape.type === 'text') {
      setSelectedShapeIndex(index);
      setDragOffset({
        dx: cords.x - shape.x,
        dy: cords.y - shape.y,
      });
      return index;
    }

    if(shape.type === 'pencil'){
      setSelectedShapeIndex(index);
      setDragOffset({
        dx: cords.x - shape.points[0].x,
        dy: cords.y - shape.points[0].y,
      });
      return index;
    }

    const shapeStart = shape.dimension[0];
    setSelectedShapeIndex(index);
    setDragOffset({
      dx: cords.x - shapeStart.x,
      dy: cords.y - shapeStart.y,
    });
    return index;
  }
  else {
    setSelectedShapeIndex(null);
    return -1;
  }
}

function isCursorOnHandler(cursor: any, handler: any, handleSize = 12) {
  const dx = cursor.x - handler.x;
  const dy = cursor.y - handler.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance <= handleSize / 2;
}

export function checkIsCursorOnHandlers(cords: Dimension, selectedShapeIndex: number | null, shapes: Shape[], ctx: CanvasRenderingContext2D) {
  if (selectedShapeIndex === null) return false;
  const shape = shapes[selectedShapeIndex];
  const box = getBoundingBox(shape, ctx);
  if (!box) return false;

  const pos = getHandlerPositions(box, 4);
  const handleSize = 12;

  const handlers = pos.handlers;
  for (let i = 0; i < handlers.length; i++) {
    if (isCursorOnHandler(cords, handlers[i], handleSize)) {
      return i;
    }
  }
  return false;
}