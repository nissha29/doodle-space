import { Shape } from "@repo/common/types";

export default function isPointInShape(point: { x: number, y: number }, shape: Shape) {
  switch (shape.type) {
    case "rectangle":
      return isPointInRect(point, shape);
    case "circle":
      return isPointInCircle(point, shape);
    case "diamond":
      return isPointInDiamond(point, shape);
    case "arrow":
      return isPointNearArrow(point, shape, 5);
    case "line":
      return isPointNearLine(point, shape, 10);
    default:
      return false;
  }
}

function isPointInRect(point: { x: number, y: number }, shape: Shape) {
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

function isPointInCircle(point: { x: number, y: number }, shape: Shape) {
  if (shape.type !== "circle") return false;
  const [start, end] = shape.dimension;
  const cx = start.x, cy = start.y;
  const r = shape.diameter / 2;
  return distanceSq(point.x, point.y, cx, cy) <= r * r;
}

function isPointInDiamond(point: { x: number, y: number }, shape: Shape) {
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


function isPointNearArrow(point: { x: number, y: number }, shape: Shape, tolerance: number) {
  if(shape.type !== "arrow") return false;
  const shaft = shape.shaft;
  const nearShaft = pointLineDist(point.x, point.y, shaft.x1, shaft.y1, shaft.x2, shaft.y2) <= tolerance;
  const nearLeft = pointLineDist(point.x, point.y, shape.tip[0], shape.tip[1], shape.left[0], shape.left[1]) <= tolerance;
  const nearRight = pointLineDist(point.x, point.y, shape.tip[0], shape.tip[1], shape.right[0], shape.right[1]) <= tolerance;
  return nearShaft || nearLeft || nearRight;
}

function isPointNearLine(point: { x: number, y: number }, shape: Shape, tolerance: number) {
  if (shape.type !== "line") return false;
  return pointLineDist(point.x, point.y, shape.x1, shape.y1, shape.x2, shape.y2) <= tolerance;
}