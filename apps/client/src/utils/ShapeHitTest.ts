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
      return isPointNearLine(point, shape, 5);
    default:
      return false;
  }
}

function isPointInRect(point: { x: number, y: number }, shape: Shape) {

}

function isPointInCircle(point: { x: number, y: number }, shape: Shape) {
  
}

function isPointInDiamond(point: { x: number, y: number }, shape: Shape) {
  
}

function isPointNearArrow(point: { x: number, y: number }, shape: Shape, tolerance: number) {

}

function isPointNearLine(point: { x: number, y: number }, shape: Shape, tolerance: number) {
  
}