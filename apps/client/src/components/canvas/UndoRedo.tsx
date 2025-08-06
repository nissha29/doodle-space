import useSessionMode from "@/hooks/useSessionMode";
import useUndoRedo from "@/hooks/useUndoRedo";
import { Redo, Undo } from "@/icons/icons";

export function UndoRedo() {
    const { undo, redo } = useUndoRedo();
    const { mode } = useSessionMode();
  return (
    <div className={`absolute bottom-6 left-6`}>
      <div className="bg-neutral-800/60 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center">
          <button
            onClick={() => undo()}
            className="p-2.5 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 group rounded-l-xl hover:cursor-pointer"
            title="Undo — Ctrl + Z"
          >
            <Undo />
          </button>

          <button
            onClick={() => redo()}
            className="p-2.5 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 group rounded-r-xl hover:cursor-pointer"
            title="Redo — Ctrl + Y"
          >
            <Redo />
          </button>
        </div>
      </div>
    </div>
  );
}