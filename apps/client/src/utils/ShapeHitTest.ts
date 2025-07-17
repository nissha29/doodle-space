import { Dimension, Shape } from "@repo/common/types";
import { getBoundingBox } from "./boundingBox";
import { Dispatch, SetStateAction } from "react";

export function checkIsCursorInShape(cords: Dimension, shapes: Shape[], setSelectedShapeIndex: Dispatch<SetStateAction<number | null>>, setDragOffset: Dispatch<SetStateAction<{ dx: number, dy: number } | null>>) {
  const index = shapes.findIndex((shape) => isPointInsideOrOnBoundingBox(cords, shape));

  if (index !== -1) {
    const shape = shapes[index];
    const shapeStart = shape.dimension[0];
    setSelectedShapeIndex(index);
    setDragOffset({
      dx: cords.x - shapeStart.x,
      dy: cords.y - shapeStart.y,
    });
    return true;
  }
  else {
    setSelectedShapeIndex(null);
    return false;
  }
}

export function isPointInsideOrOnBoundingBox(
  cords: { x: number, y: number },
  shape: Shape,
  handlerRadius = 12
) {
  const box = getBoundingBox(shape);
  if (!box) return false;

  const handlers = [
    { x: box.minX, y: box.minY },
    { x: box.maxX, y: box.minY },
    { x: box.maxX, y: box.maxY },
    { x: box.minX, y: box.maxY },
  ];

  for (const h of handlers) {
    const distSq = (cords.x - h.x) ** 2 + (cords.y - h.y) ** 2;
    if (distSq <= (handlerRadius * handlerRadius)) {
      return false;
    }
  }

  return (
    cords.x >= box.minX &&
    cords.x <= box.maxX &&
    cords.y >= box.minY &&
    cords.y <= box.maxY
  );
}
