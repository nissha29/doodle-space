import { ToolType } from "@/types/types";
import { Shape } from "@repo/common/types";

export const makeShape = (active: ToolType, start: any, end: { x: number, y: number }, setPreviewShape: any) => {
  let shape: Shape;

  switch (active) {
    case "rectangle": {
      shape = { type: "rectangle", x: start.x, y: start.y, width: end.x - start.x, height: end.y - start.y, seed: 1 };
      break;
    }

    case "circle": {
      const diameter = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
      );
      shape = { type: "circle", x: start.x, y: start.y, diameter, seed: 2 };
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
      shape = { type: 'diamond', diamondPoints: diamondPoints, seed: 3 }
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
      shape = { type: 'arrow', shaft, tip, left, right, seed: 4 }
      break;
    }

    case "line": {
      shape = { type: "line", x1: start.x, x2: end.x, y1: start.y, y2: end.y, seed: 5 };
      break;
    }

    default:
      console.log("invalid shape type");
      return;
  }
  setPreviewShape(shape);
}