import { Shape } from "@repo/common/types";

export const makeShape = (type: string, start: any, end: { x: number, y: number }, setPreviewShape: any) => {
    let shape: Shape;

    switch (type) {
      case "rectangle":
        shape = {
          type: "rectangle",
          x1: start.x,
          x2: start.y,
          width: end.x - start.x,
          height: end.y - start.y,
        };
        break;
      case "line":
        shape = {
          type: "line",
          x1: start.x,
          x2: end.x,
          y1: start.y,
          y2: end.y,
        };
        break;
      case "circle":
        const diameter = Math.sqrt(
          Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
        );
        shape = { type: "circle", x: start.x, y: start.y, diameter };
        break;
      default:
        console.log("invalid shape type");
        return;
    }
    setPreviewShape(shape);
  }