import { Shape } from "@repo/common/types";
import { RoughGenerator } from "roughjs/bin/generator";

export const getDrawable = (shape: Shape, generator: RoughGenerator) => {
  if(! shape?.type){
    console.log('shape type not defined');
    return;
  }
  console.log(shape.type);
  switch (shape.type) {
    case "rectangle": {
      const { x, y, width, height, seed } = shape;
      return generator.rectangle(x, y, width, height, { stroke: 'white', roughness: 1, seed });
    }
    case "circle": {
      const { x, y, diameter, seed } = shape;
      return generator.circle(x, y, diameter, { stroke: 'white', roughness: 1, seed });
    }
    case "diamond": {
      const { diamondPoints, seed } = shape;
      return generator.polygon(diamondPoints, { stroke: 'white', roughness: 1, seed });
    }
    case "arrow": {
      const { x1, x2, y1, y2 } = shape.shaft;
      const { tip, left, right, seed } = shape;
      const shaft = generator.line(x1, y1, x2, y2, { stroke: 'white', roughness: 1, seed });
      const leftLine = generator.line(tip[0], tip[1], left[0], left[1], { stroke: 'white', roughness: 1.5, seed });
      const rightLine = generator.line(tip[0], tip[1], right[0], right[1], { stroke: 'white', roughness: 1.5, seed });
      return [shaft, leftLine, rightLine];
    }
    case "line": {
      const { x1, y1, x2, y2, seed } = shape;
      return generator.line(x1, y1, x2, y2, { stroke: 'white', roughness: 0.4, seed });
    }
    default:
      console.log("invalid shape type");
      return;
  }
};
