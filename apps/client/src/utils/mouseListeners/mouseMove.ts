import { ToolType } from "@/types/types";
import { Dimension, Shape } from "@repo/common/types";
import { Dispatch, SetStateAction } from "react";

export const makeShape = (active: ToolType, start: Dimension, end: Dimension) => {
  let shape: Shape;

  switch (active) {
    case "rectangle": {
      shape = { type: "rectangle", dimension: [start, end], x: start.x, y: start.y, width: end.x - start.x, height: end.y - start.y, seed: 1 };
      break;
    }

    case "circle": {
      const diameter = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
      );
      shape = { type: "circle", dimension: [start, end], x: start.x, y: start.y, diameter, seed: 2 };
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
      shape = { type: 'diamond', dimension: [start, end], diamondPoints: diamondPoints, seed: 3 }
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
      shape = { type: 'arrow', dimension: [start, end], shaft, tip, left, right, seed: 4 }
      break;
    }

    case "line": {
      shape = { type: "line", dimension: [start, end], x1: start.x, x2: end.x, y1: start.y, y2: end.y, seed: 5 };
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
          return shape;
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
        return makeShape(shape.type, start, end)!;
      }
      return shape;
    })
  );
}

export function handleMouseMovementOnResize(
  mouse: Dimension,
  shapes: Shape[],
  setShapes: Dispatch<SetStateAction<Shape[]>>,
  selectedShapeIndex: number,
  resizeHandleIndex: number | null,
) {
  const initialShape = shapes[selectedShapeIndex];
  if (!initialShape) {
    return; 
  }

  setShapes((prev: Shape[]) =>
    prev.map((shape, index) => {
      if (index !== selectedShapeIndex) return shape;
      if(initialShape.type === 'text'){
        return shape;
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
      return makeShape(shape.type, newStart, newEnd)!;
    })
  );
}
