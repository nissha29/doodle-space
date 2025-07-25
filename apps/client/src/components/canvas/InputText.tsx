import useUndoRedo from "@/hooks/useUndoRedo";
import { TextInput } from "@/types/types";
import { Dimension, Shape } from "@repo/common/types";
import { Dispatch, SetStateAction } from "react";

export function InputText({
  textInput,
  setShapes,
  setTextInput,
  shapes,
  panOffset
}: {
  textInput: TextInput | null;
  setShapes: Dispatch<SetStateAction<Shape[]>>;
  setTextInput: Dispatch<SetStateAction<TextInput | null>>;
  shapes: Shape[];
  panOffset: Dimension
}) {
  const { addAction } = useUndoRedo();

  return (
    textInput && (
      <input
        className="absolute text-[#0ff] bg-transparent border-[#0ff] border-dashed p-5 outline-none text-2xl font-[Indie_Flower]"
        style={{
          top: textInput.cords.y - panOffset.y,
          left: textInput.cords.x - panOffset.x,
          position: "absolute",
          zIndex: 10,
        }}
        value={textInput.value}
        autoFocus
        onBlur={() => {
          if (textInput.value.trim()) {
            const DEFAULT_LINE_HEIGHT = 40;
            const lastText = [...shapes]
              .reverse()
              .find((s) => s.type === "text");

            const safeY = lastText
              ? lastText.y + DEFAULT_LINE_HEIGHT
              : textInput.cords.y;

            const text: Shape = {
              type: "text",
              x: textInput.cords.x,
              y: textInput.cords.y,
              text: textInput.value,
              font: "24px 'Indie Flower'",
              color: ''
            };
            
            addAction([...shapes, text])
            setShapes((prev: any) => [...prev, text]);
          }
          setTextInput(null);
        }}
        onChange={(e) =>
          setTextInput((prev) => prev && { ...prev, value: e.target.value })
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          }
        }}
      />
    )
  );
}
