import { Shape } from "@repo/common/types";
import { RoughGenerator } from "roughjs/bin/generator";

export const getDrawable = (shape: Shape, generator: RoughGenerator) => {
    switch (shape.type) {
      case "rectangle": {
        const { x1, x2, width, height } = shape;
        return generator.rectangle(x1, x2, width, height, { stroke: 'white'});
      }
      case "circle": {
        const { x, y, diameter } = shape;
        return generator.circle(x, y, diameter, { stroke: 'white'});
      }
      case "diamond": {
        const { diamondPoints } = shape;
        return generator.polygon(diamondPoints, { stroke: 'white'});
      }
      case "line": {
        const { x1, y1, x2, y2 } = shape;
        return generator.line(x1, y1, x2, y2, { stroke: 'white'});
      }
      default:
        console.log("invalid shape type");
        return;
    }
  };
