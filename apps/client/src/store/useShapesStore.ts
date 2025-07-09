import { ShapeStore } from '@/types/types';
import { create } from 'zustand';

export const useShapesStore = create<ShapeStore>((set) => ({
  existingShapes: [],
  addShape: (shape) =>
    set((state) => ({
      existingShapes: [...state.existingShapes, shape],
    })),
  setShapes: (existingShapes) => set({ existingShapes }),
}));