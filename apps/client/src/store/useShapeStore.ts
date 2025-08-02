import { ShapeStore } from '@/types/types';
import { create } from 'zustand';
import { SetStateAction } from "react";
import { Shape } from '@repo/common/types';

export const useShapeStore = create<ShapeStore>()((set) => ({
  shapes: [],
  setShapes: (shapes: SetStateAction<Shape[]>) =>
    set((state) => ({
      shapes:
        typeof shapes === "function"
          ? (shapes as (prev: Shape[]) => Shape[])(state.shapes)
          : shapes,
    })),
}));

