import { ToolType } from "@/types/types";
import { Dimension, Shape } from "@repo/common/types";
import { Dispatch, SetStateAction } from "react";
import { getBoundingBox } from "../boundingBox";
import { v4 as uuidv4 } from 'uuid';

export const makeShape = (active: ToolType, start: Dimension, end: Dimension, existingId?: string) => {
  let shape: Shape;

  let id = existingId || uuidv4();

  switch (active) {
    case "rectangle": {
      shape = { id, type: "rectangle", dimension: [start, end], x: start.x, y: start.y, width: end.x - start.x, height: end.y - start.y, seed: 1 };
      break;
    }

    case "circle": {
      const diameter = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
      );
      shape = { id, type: "circle", dimension: [start, end], x: start.x, y: start.y, diameter, seed: 2 };
      break;
    }

    case "diamond": {
      const cx = (start.x + end.x) / 2;
      const cy = (start.y + end.y) / 2;
      const size = Math.abs(end.x - start.x) / 2;
      const diamondPoints: [number, number][] = [
        [cx, cy - size],
        [cx + size, cy],
        [cx, cy + size],
        [cx - size, cy],
      ];
      shape = { id, type: 'diamond', dimension: [start, end], diamondPoints: diamondPoints, seed: 3 }
      break;
    }

    case "arrow": {
      const headLength = 20;
      const angle = Math.atan2(end.y - start.y, end.x - start.x);

      const shaft = { x1: start.x, x2: end.x, y1: start.y, y2: end.y };
      const tip = [end.x, end.y];
      const left = [
        end.x - headLength * Math.cos(angle - Math.PI / 6),
        end.y - headLength * Math.sin(angle - Math.PI / 6)
      ];
      const right = [
        end.x - headLength * Math.cos(angle + Math.PI / 6),
        end.y - headLength * Math.sin(angle + Math.PI / 6)
      ];
      shape = { id, type: 'arrow', dimension: [start, end], shaft, tip, left, right, seed: 4 }
      break;
    }

    case "line": {
      shape = { id, type: "line", dimension: [start, end], x1: start.x, x2: end.x, y1: start.y, y2: end.y, seed: 5 };
      break;
    }

    default:
      console.log("invalid shape type");
      return;
  }
  return shape;
}

export function handleMouseMovementOnMove(mouse: Dimension, setShapes: Dispatch<SetStateAction<Shape[]>>, selectedShapeIndex: number, dragOffset: { dx: number, dy: number }) {
  setShapes((prev: Shape[]) =>
    prev.map((shape, index) => {
      if (index === selectedShapeIndex) {

        if (shape.type === 'text') {
          const newX = mouse.x - dragOffset.dx;
          const newY = mouse.y - dragOffset.dy;

          return {
            ...shape,
            x: newX,
            y: newY,
          };
        }
        else if (shape.type === 'pencil') {
          const dx = mouse.x - dragOffset.dx;
          const dy = mouse.y - dragOffset.dy;

          const point0 = shape.points[0];
          const moveDelta = {
            dx: dx - point0.x,
            dy: dy - point0.y,
          };

          const movedPoints = shape.points.map((pt) => ({
            x: pt.x + moveDelta.dx,
            y: pt.y + moveDelta.dy,
          }));

          return {
            ...shape,
            points: movedPoints,
          };
        }
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
        return makeShape(shape.type, start, end, shape.id)!;
      }
      return shape;
    })
  );
}

export function textResize(initialShape: Shape, mouse: Dimension, shape: Shape) {
  if (initialShape.type === 'text') {
    const anchor = { x: initialShape.x, y: initialShape.y };
    let newFontSize = parseInt(initialShape.font || "24", 10);

    const height = Math.abs(mouse.y - anchor.y);
    newFontSize = Math.max(12, Math.min(200, height));

    const fontFamily = (initialShape.font || "24px Arial").split(" ").slice(1).join(" ") || "Arial";
    const newFont = `${newFontSize}px ${fontFamily}`;

    return {
      ...shape,
      font: newFont,
    };
  }
}

export function freeDrawResize(initialShape: Shape, mouse: Dimension, shape: Shape, resizeHandleIndex: number | null, ctx: CanvasRenderingContext2D) {
  if (initialShape.type !== 'pencil') return shape;
  const oldPoints = initialShape.points;

  const box = getBoundingBox(initialShape, ctx);
  const { minX, maxX, minY, maxY } = box!;

  const oldWidth = maxX - minX || 1;
  const oldHeight = maxY - minY || 1;

  let newMinX = minX, newMinY = minY, newMaxX = maxX, newMaxY = maxY;
  switch (resizeHandleIndex) {
    case 0: 
      newMinX = mouse.x;
      newMinY = mouse.y;
      break;
    case 1: 
      newMaxX = mouse.x;
      newMinY = mouse.y;
      break;
    case 2:
      newMaxX = mouse.x;
      newMaxY = mouse.y;
      break;
    case 3:
      newMinX = mouse.x;
      newMaxY = mouse.y;
      break;
    default: 
      newMaxX = mouse.x;
      newMaxY = mouse.y;
  }

  const newWidth = newMaxX - newMinX || 1;
  const newHeight = newMaxY - newMinY || 1;

  const scaledPoints = oldPoints.map(p => ({
    x: newMinX + ((p.x - minX) / oldWidth) * newWidth,
    y: newMinY + ((p.y - minY) / oldHeight) * newHeight,
  }));

  return {
    ...shape,
    points: scaledPoints,
  };
}


export function handleMouseMovementOnResize(
  mouse: Dimension,
  shapes: Shape[],
  setShapes: Dispatch<SetStateAction<Shape[]>>,
  selectedShapeIndex: number,
  resizeHandleIndex: number | null,
  ctx: CanvasRenderingContext2D
) {
  const initialShape = shapes[selectedShapeIndex];
  if (!initialShape) {
    return;
  }

  setShapes((prev: Shape[]) =>
    prev.map((shape, index) => {
      if (index !== selectedShapeIndex) return shape;
      if (initialShape.type === 'text') {
        const newText = textResize(initialShape, mouse, shape);
        return newText!;
      } else if (initialShape.type === 'pencil') {
        const newDraw = freeDrawResize(initialShape, mouse, shape, resizeHandleIndex, ctx);
        return newDraw!;
      }

      const [start, end] = initialShape.dimension;
      let newStart = { ...start };
      let newEnd = { ...end };

      switch (resizeHandleIndex) {
        case 0:
          newStart = mouse;
          newEnd = end;
          break;
        case 1:
          newStart = { x: start.x, y: mouse.y };
          newEnd = { x: mouse.x, y: end.y };
          break;
        case 2:
          newStart = start;
          newEnd = mouse;
          break;
        case 3:
          newStart = { x: mouse.x, y: start.y };
          newEnd = { x: end.x, y: mouse.y };
          break;
        default:
          newStart = start;
          newEnd = mouse;
      }
      return makeShape(shape.type, newStart, newEnd, shape.id)!;
    })
  );
}
