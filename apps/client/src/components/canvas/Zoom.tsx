import { Minus, Plus } from "@/icons/icons";

export function Zoom({ zoom, zoomIn, zoomOut, resetZoom }: { zoom: number, zoomIn: () => void, zoomOut: () => void, resetZoom: () => void}) {
  const formatZoom = (value: number) => `${Math.round(value * 100)}%`;

  return (
    <div className="fixed bottom-6 left-10">
      <div className="bg-neutral-800/60 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center">
          <button
            onClick={zoomOut}
            disabled={zoom <= 0.1}
            className="p-2.5 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 group rounded-l-xl hover:cursor-pointer"
            title="Zoom Out"
          >
            <Minus />
          </button>

          <button
            onClick={resetZoom}
            className="px-4 py-2 text-white tracking-wider text-lg hover:bg-white/5 transition-colors hover:cursor-pointer"
            title="Reset to 100%"
          >
            {formatZoom(zoom)}
          </button>

          <button
            onClick={zoomIn}
            disabled={zoom >= 10}
            className="p-2.5 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 group rounded-r-xl hover:cursor-pointer"
            title="Zoom In"
          >
            <Plus />
          </button>
        </div>
      </div>
    </div>
  );
}