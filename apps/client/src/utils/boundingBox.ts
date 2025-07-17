import { Shape } from "@repo/common/types";

export function getBoundingBox(shape: Shape) {
  switch (shape.type) {
    case "rectangle":
      return {
        minX: Math.min(shape.dimension[0].x, shape.dimension[1].x),
        minY: Math.min(shape.dimension[0].y, shape.dimension[1].y),
        maxX: Math.max(shape.dimension[0].x, shape.dimension[1].x),
        maxY: Math.max(shape.dimension[0].y, shape.dimension[1].y),
      };
    case "circle": {
      const r = shape.diameter / 2;
      return {
        minX: shape.dimension[0].x - r,
        minY: shape.dimension[0].y - r,
        maxX: shape.dimension[0].x + r,
        maxY: shape.dimension[0].y + r,
      };
    }
    case "diamond": {
      const xs = shape.diamondPoints.map(([x, _]) => x);
      const ys = shape.diamondPoints.map(([_, y]) => y);
      return {
        minX: Math.min(...xs),
        minY: Math.min(...ys),
        maxX: Math.max(...xs),
        maxY: Math.max(...ys),
      };
    }
    case "arrow":
    case "line": {
      const xs = [shape.dimension[0].x, shape.dimension[1].x];
      const ys = [shape.dimension[0].y, shape.dimension[1].y];
      return {
        minX: Math.min(...xs),
        minY: Math.min(...ys),
        maxX: Math.max(...xs),
        maxY: Math.max(...ys),
      };
    }
    default: return null;
  }
}
