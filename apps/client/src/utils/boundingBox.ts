import { Dimension, Shape } from "@repo/common/types";
import { RoughGenerator } from "roughjs/bin/generator";

export function getHandlerPositions(box: any, pad = 4) {
  const paddedBox = {
    minX: box.minX - pad,
    minY: box.minY - pad,
    maxX: box.maxX + pad,
    maxY: box.maxY + pad,
  };
  return {
    paddedBox,
    handlers: [
      { x: paddedBox.minX, y: paddedBox.minY },
      { x: paddedBox.maxX, y: paddedBox.minY },
      { x: paddedBox.maxX, y: paddedBox.maxY },
      { x: paddedBox.minX, y: paddedBox.maxY },
    ]
  }

}

export function getBoundingBox(shape: Shape, ctx: CanvasRenderingContext2D) {
  if(! shape) return;
  
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
    case "text":
      ctx.font = shape.font || "24px Arial";
      const width = ctx.measureText(shape.text).width;
      const height = parseInt((shape.font || "24"), 10);
      return {
        minX: shape.x,
        minY: shape.y,
        maxX: shape.x + width,
        maxY: shape.y + height
      }
    case "pencil":
      if (!shape.points || shape.points.length === 0) return null;
      const xs = shape.points.map(p => p.x);
      const ys = shape.points.map(p => p.y);
      return {
        minX: Math.min(...xs),
        minY: Math.min(...ys),
        maxX: Math.max(...xs),
        maxY: Math.max(...ys)
      };
    default:
      return null;
  }
}

export function drawBoundingBoxAndHandlers(
  generator: RoughGenerator,
  roughCanvas: any,
  box: { minX: number, minY: number, maxX: number, maxY: number },
  panOffset: Dimension,
  handleSize = 12
) {

  const pos = getHandlerPositions(box);

  const rectDrawable = generator.rectangle(
    pos.paddedBox.minX - panOffset.x,
    pos.paddedBox.minY - panOffset.y,
    pos.paddedBox.maxX - pos.paddedBox.minX,
    pos.paddedBox.maxY - pos.paddedBox.minY,
    {
      stroke: "#00cccc",
      strokeWidth: 0.7,
      roughness: 0.001,
      seed: 278,
      dashGap: 3,
      bowing: 0.8,
    }
  );
  roughCanvas.draw(rectDrawable);

  const handlers = pos.handlers;

  handlers.forEach((h) => {
    const circleDrawable = generator.circle(h.x - panOffset.x, h.y - panOffset.y, handleSize, {
      stroke: "#00FFFFaa",
      fillStyle: '',
      roughness: 0.001,
      strokeWidth: 3,
      seed: 155,
    });
    roughCanvas.draw(circleDrawable);
  });
}


