import { RoughGenerator } from "roughjs/bin/generator";

export function drawBoundingBoxAndHandlers(
  generator: RoughGenerator,
  roughCanvas: any,
  box: { minX: number, minY: number, maxX: number, maxY: number },
  pad = 4,
  handleSize = 12
) {
  
  const paddedBox = {
    minX: box.minX - pad,
    minY: box.minY - pad,
    maxX: box.maxX + pad,
    maxY: box.maxY + pad,
  };

  const rectDrawable = generator.rectangle(
    paddedBox.minX,
    paddedBox.minY,
    paddedBox.maxX - paddedBox.minX,
    paddedBox.maxY - paddedBox.minY,
    {
      stroke: "#00cccc",
      strokeWidth: 1.5,
      roughness: 0.001,
      seed: 278,
      dashGap: 3,
      bowing: 0.8,
      fill: "rgba(0,0,0,0)",
    }
  );
  roughCanvas.draw(rectDrawable);

  const handlers = [
    { x: paddedBox.minX, y: paddedBox.minY },
    { x: paddedBox.maxX, y: paddedBox.minY },
    { x: paddedBox.maxX, y: paddedBox.maxY },
    { x: paddedBox.minX, y: paddedBox.maxY },
  ];

  handlers.forEach((h) => {
    const circleDrawable = generator.circle(h.x, h.y, handleSize, {
      stroke: "#0ff",
      fill: '#00FFFFaa',
      fillStyle: 'solid',
      roughness: 0.001,
      strokeWidth: 1.2,
      seed: 155,
    });
    roughCanvas.draw(circleDrawable);
  });
}
