import { ToolType } from "@/types/types";
import { Shape } from "@repo/common/types";

export const makeShape = (active: ToolType, start: any, end: { x: number, y: number }, setPreviewShape: any) => {
  let shape: Shape;

  switch (active) {
    case "rectangle": {
      shape = { type: "rectangle", x1: start.x, x2: start.y, width: end.x - start.x, height: end.y - start.y };
      break;
    }

    case "circle": {
      const diameter = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
      );
      shape = { type: "circle", x: start.x, y: start.y, diameter };
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
      shape = { type: 'diamond', diamondPoints: diamondPoints }
      break;
    }

    case "line": {
      shape = { type: "line", x1: start.x, x2: end.x, y1: start.y, y2: end.y };
      break;
    }

    default:
      console.log("invalid shape type");
      return;
  }
  setPreviewShape(shape);
}