import { Dimension, Shape } from "@repo/common/types";
import { getBoundingBox } from "./boundingBox";

export function isPointInsideOrOnBoundingBox(
  cords: { x: number, y: number },
  shape: Shape,
  ctx: CanvasRenderingContext2D,
  handlerRadius = 12
) {
  const box = getBoundingBox(shape, ctx);
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


export default function isPointInShape(shape: Shape, point: Dimension, ctx?: CanvasRenderingContext2D) {
  if(ctx && shape.type === 'text'){
    return isPointInText(point, shape, ctx);
  }
  else if(shape.type === 'pencil'){
    return isPointOnDrawing(point, shape.points);
  }
  switch (shape.type) {
    case "rectangle":
      return isPointInRect(point, shape);
    case "circle":
      return isPointInCircle(point, shape);
    case "diamond":
      return isPointInDiamond(point, shape);
    case "arrow":
      return isPointNearArrow(point, shape, 10);
    case "line":
      return isPointNearLine(point, shape, 10);
    default:
      return false;
  }
}

function isPointInRect(point: { x: number, y: number }, shape: Shape): boolean {
  if (shape.type !== 'rectangle') return false;

  const [start, end] = shape.dimension;

  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);

  return (
    point.x >= x &&
    point.x <= x + width &&
    point.y >= y &&
    point.y <= y + height
  );
}

function distanceSq(x1: number, y1: number, x2: number, y2: number) {
  return (x1 - x2) ** 2 + (y1 - y2) ** 2;
}

function isPointInCircle(point: { x: number, y: number }, shape: Shape): boolean {

  if (shape.type !== "circle") return false;
  const [start, end] = shape.dimension;
  const cx = start.x, cy = start.y;
  const r = shape.diameter / 2;
  return distanceSq(point.x, point.y, cx, cy) <= r * r;
}

function isPointInDiamond(point: { x: number, y: number }, shape: Shape): boolean {

  if (shape.type !== "diamond") return false;
  const pts = shape.diamondPoints;

  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i][0], yi = pts[i][1];
    const xj = pts[j][0], yj = pts[j][1];
    if (
      (yi > point.y) !== (yj > point.y) &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi + Number.EPSILON) + xi
    ) {
      inside = !inside;
    }
  }
  return inside;
}

function pointLineDist(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0 && dy === 0) return Math.sqrt(distanceSq(px, py, x1, y1));
  const t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);
  const clampedT = Math.max(0, Math.min(1, t));
  const closeX = x1 + clampedT * dx;
  const closeY = y1 + clampedT * dy;
  return Math.sqrt(distanceSq(px, py, closeX, closeY));
}

function isPointNearArrow(point: { x: number, y: number }, shape: Shape, tolerance: number): boolean {
  if (shape.type !== "arrow") return false;
  const shaft = shape.shaft;
  const nearShaft = pointLineDist(point.x, point.y, shaft.x1, shaft.y1, shaft.x2, shaft.y2) <= tolerance;
  const nearLeft = pointLineDist(point.x, point.y, shape.tip[0], shape.tip[1], shape.left[0], shape.left[1]) <= tolerance;
  const nearRight = pointLineDist(point.x, point.y, shape.tip[0], shape.tip[1], shape.right[0], shape.right[1]) <= tolerance;
  return nearShaft || nearLeft || nearRight;
}

function isPointNearLine(point: { x: number, y: number }, shape: Shape, tolerance: number): boolean {

  if (shape.type !== "line") return false;
  return pointLineDist(point.x, point.y, shape.x1, shape.y1, shape.x2, shape.y2) <= tolerance;
}

function isPointInText(
  cords: Dimension,
  shape: Shape,
  ctx: CanvasRenderingContext2D
): boolean {
  if (shape.type !== 'text') return false;

  ctx.font = shape.font || "24px 'Indie_Flower'";
  const width = ctx.measureText(shape.text).width;
  const height = parseInt(shape.font || "24", 10);

  return (
    cords.x >= shape.x &&
    cords.x <= shape.x + width &&
    cords.y >= shape.y &&
    cords.y <= shape.y + height
  );
}

function isPointOnDrawing(cords: Dimension, points: Dimension[], tolerance = 8): boolean {
  if (!points || points.length === 0) return false;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const dist = pointLineDistance(cords.x, cords.y, p1.x, p1.y, p2.x, p2.y);
    if (dist <= tolerance) return true;
  }
  if (points.length === 1) {
    const d = Math.sqrt((cords.x - points[0].x) ** 2 + (cords.y - points[0].y) ** 2);
    if (d <= tolerance) return true;
  }
  return false;
}

function pointLineDistance(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0 && dy === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
  const t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);
  const clampedT = Math.max(0, Math.min(1, t));
  const closeX = x1 + clampedT * dx;
  const closeY = y1 + clampedT * dy;
  return Math.sqrt((px - closeX) ** 2 + (py - closeY) ** 2);
}