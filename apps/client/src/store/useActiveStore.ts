import { ShapeTypeStore } from '@/types/types';
import { create } from 'zustand';

export const useActiveStore = create<ShapeTypeStore>()(
    (set) => ({
        activeTool: 'select',
        setActive: (activeTool) => set({ activeTool })
    }),
);
