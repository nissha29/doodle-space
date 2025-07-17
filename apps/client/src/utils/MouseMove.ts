import { Dimension, Shape } from "@repo/common/types";
import { makeShape } from "./makeShape";
import { Dispatch, SetStateAction } from "react";

export function handleMouseMovementOnMove(mouse: Dimension, setShapes: Dispatch<SetStateAction<Shape[]>>, selectedShapeIndex: number, dragOffset: { dx: number, dy: number }) {
    setShapes((prev: Shape[]) =>
      prev.map((shape, index) => {
        if (index === selectedShapeIndex) {
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