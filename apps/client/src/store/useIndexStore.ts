import { IndexStore, ShapeTypeStore } from '@/types/types';
import { create } from 'zustand';

export const useIndexStore = create<IndexStore>()(
    (set) => ({
        index: 0,
        setIndex: (updater: number | ((prevIndex: number) => number)) =>
            set((state) => ({
                index:
                    typeof updater === 'function'
                        ? updater(state.index)
                        : updater,
            })),
    }),
);
