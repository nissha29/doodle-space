import { Shape } from "@repo/common/types";
import { getBoundingBox } from "./boundingBox";

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
