import { useCurrentCanvasStore } from "@/store/useCurrentCanvasStore";
import { useIndexStore } from "@/store/useIndexStore";
import { Shape } from "@repo/common/types";

export default function useUndoRedo() {
  const currentCanvas = useCurrentCanvasStore((s) => s.currentCanvas);
  const setCurrentCanvas = useCurrentCanvasStore((s) => s.setCurrentCanvas);
  const index = useIndexStore((s) => s.index);
  const setIndex = useIndexStore((s) => s.setIndex);

  const addAction = (newShapes: Shape[]) => {
    setCurrentCanvas((prev) => {
      const truncated = prev.slice(0, index + 1);
      const updated = [...truncated, newShapes];
      return updated;
    });
    setIndex((prev) => prev + 1); 
  };

  const undo = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const redo = () => {
    setIndex((prev) =>
      currentCanvas && prev < currentCanvas.length - 1 ? prev + 1 : prev
    );
  };

  const resetCanvas = () => {
    setCurrentCanvas([[]]);
    setIndex(0);
  };

  return { addAction, undo, redo, resetCanvas };
}
