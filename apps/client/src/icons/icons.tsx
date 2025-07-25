import { useActiveStore } from "@/store/useActiveStore";

export function Circle() {
  const activeTool = useActiveStore((s) => s.activeTool);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      name="circle"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={`${activeTool === "circle" ? "2" : "1"}`}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-circle-icon lucide-circle"
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export function Rectangle() {
  const activeTool = useActiveStore((s) => s.activeTool);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={`${activeTool === "rectangle" ? "2" : "1"}`}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-square-icon lucide-square"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
    </svg>
  );
}

export function Diamond() {
  const activeTool = useActiveStore((s) => s.activeTool);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      name="diamond"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={`${activeTool === "diamond" ? "2" : "1"}`}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-diamond-icon lucide-diamond"
    >
      <path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z" />
    </svg>
  );
}

export function Arrow() {
  const activeTool = useActiveStore((s) => s.activeTool);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      name="arrow"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={`${activeTool === "arrow" ? "2" : "1"}`}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-move-up-right-icon lucide-move-up-right"
    >
      <path d="M13 5H19V11" />
      <path d="M19 5L5 19" />
    </svg>
  );
}

export function Line() {
  const activeTool = useActiveStore((s) => s.activeTool);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      name="line"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={`${activeTool === "line" ? "2" : "1"}`}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-minus-icon lucide-minus"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

export function Pencil() {
  const activeTool = useActiveStore((s) => s.activeTool);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      name="pencil"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={`${activeTool === "pencil" ? "2" : "1"}`}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-pencil-icon lucide-pencil"
    >
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

export function Text() {
  const activeTool = useActiveStore((s) => s.activeTool);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      name="text"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={`${activeTool === "text" ? "2" : "1"}`}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-type-outline-icon lucide-type-outline"
    >
      <path d="M14 16.5a.5.5 0 0 0 .5.5h.5a2 2 0 0 1 0 4H9a2 2 0 0 1 0-4h.5a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V8a2 2 0 0 1-4 0V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 1-4 0v-.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5Z" />
    </svg>
  );
}

export function Eraser() {
  const activeTool = useActiveStore((s) => s.activeTool);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      name="eraser"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={`${activeTool === "eraser" ? "2" : "1"}`}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-eraser-icon lucide-eraser"
    >
      <path d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21" />
      <path d="m5.082 11.09 8.828 8.828" />
    </svg>
  );
}

export function Pan() {
  const activeTool = useActiveStore((s) => s.activeTool);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      name="hand"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={`${activeTool === "pan" ? "2" : "1"}`}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-hand-icon lucide-hand"
    >
      <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
      <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

export function Select() {
  const activeTool = useActiveStore((s) => s.activeTool);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={`${activeTool === "select" ? "2" : "1"}`}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-mouse-pointer-icon lucide-mouse-pointer"
    >
      <path d="M12.586 12.586 19 19" />
      <path d="M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z" />
    </svg>
  );
}

export function Plus() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-plus-icon lucide-plus hover:scale-110"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

export function Minus() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-minus-icon lucide-minus hover:scale-110"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

export function Undo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-undo2-icon lucide-undo-2 hover:scale-110"
    >
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" />
    </svg>
  );
}

export function Redo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-redo2-icon lucide-redo-2 hover:scale-110"
    >
      <path d="m15 14 5-5-5-5" />
      <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13" />
    </svg>
  );
}
