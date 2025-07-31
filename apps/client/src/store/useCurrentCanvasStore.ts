import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CurrentCanvasStore } from '@/types/types';

export const useCurrentCanvasStore = create<CurrentCanvasStore>()(
  persist(
    (set) => ({
      currentCanvas: [[]],
      setCurrentCanvas: (updater) =>
        set((state) => ({
          currentCanvas:
            typeof updater === "function"
              ? updater(state.currentCanvas)
              : updater,
        })),
    }),
    {
      name: 'current-canvas',
    }
  )
);
