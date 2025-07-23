import { CurrentCanvasStore, ShapeTypeStore } from '@/types/types';
import { create } from 'zustand';

export const useCurrentCanvasStore = create<CurrentCanvasStore>()(
    (set) => ({
        currentCanvas: [[]],
        setCurrentCanvas: (updater) =>
            set((state) => ({
                currentCanvas: typeof updater === "function"
                    ? updater(state.currentCanvas)
                    : updater,
            })),
    }),
);
