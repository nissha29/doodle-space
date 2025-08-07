import {
  Arrow,
  Circle,
  Diamond,
  Eraser,
  Pan,
  Line,
  Pencil,
  Rectangle,
  Select,
  Text,
} from "@/icons/icons";
import { useActiveStore } from "@/store/useActiveStore";
import { ToolType } from "@/types/types";
import { ReactNode, useState } from "react";

export function SelectTool() {
  const setActiveTool = useActiveStore((s) => s.setActive);
  function selectedTool(tool: ToolType) {
    setActiveTool(tool);
  }
  return (
    <div className="bg-neutral-800/60 backdrop-blur-md p-2 sm:px-3.5 sm:py-4 rounded-lg">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Tool
            onClick={() => selectedTool("rectangle")}
            name="rectangle"
            toolTip="Rectangle"
          >
            <Rectangle />
          </Tool>
          <Tool
            onClick={() => selectedTool("circle")}
            name="circle"
            toolTip="Circle"
          >
            <Circle />
          </Tool>
          <Tool
            onClick={() => selectedTool("diamond")}
            name="diamond"
            toolTip="Diamond"
          >
            <Diamond />
          </Tool>
          <Tool
            onClick={() => selectedTool("arrow")}
            name="arrow"
            toolTip="Arrow"
          >
            <Arrow />
          </Tool>
        </div>

        <div className="w-full h-px bg-neutral-700/50 my-1"></div>

        <div className="flex flex-col gap-2">
          <Tool onClick={() => selectedTool("line")} name="line" toolTip="Line">
            <Line />
          </Tool>
          <Tool
            onClick={() => selectedTool("pencil")}
            name="pencil"
            toolTip="Pencil"
          >
            <Pencil />
          </Tool>
          <Tool onClick={() => selectedTool("text")} name="text" toolTip="Text">
            <Text />
          </Tool>
        </div>

        <div className="w-full h-px bg-neutral-700/50 my-1"></div>

        <div className="flex flex-col gap-2">
          <Tool
            onClick={() => selectedTool("eraser")}
            name="eraser"
            toolTip="Eraser"
          >
            <Eraser />
          </Tool>

          <Tool
            onClick={() => selectedTool("pan")}
            name="pan"
            toolTip="Hand - Panning tool"
          >
            <Pan />
          </Tool>
          <Tool
            onClick={() => selectedTool("select")}
            name="select"
            toolTip="Select"
          >
            <Select />
          </Tool>
        </div>
      </div>
    </div>
  );
}

export function Tool({
  children,
  onClick,
  name,
  toolTip,
}: {
  children: ReactNode;
  onClick: () => void;
  name: ToolType;
  toolTip: string;
}) {
  const activeTool = useActiveStore((s) => s.activeTool);
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={`flex justify-center items-center hover:bg-white/5 hover:scale-110 hover:cursor-pointer w-9 h-9 rounded-lg transition-all ease-in-out duration-300 ${activeTool === name ? `text-cyan-300 scale-110 bg-neutral-600/30` : ``}`}
    >
      {children}
      {hovered && (
        <div className="absolute right-8 -translate-x-5 px-2 py-0.5 rounded bg-white text-neutral-900 whitespace-nowrap z-10 shadow-lg text-sm">
          {toolTip}
        </div>
      )}
    </button>
  );
}
