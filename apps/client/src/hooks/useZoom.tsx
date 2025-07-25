import { useState } from "react";

export function useZoom() {
  const [zoom, setZoom] = useState(1);

  const ZOOM_STEP = 1.2;
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 5;

  const zoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom * ZOOM_STEP, MAX_ZOOM));
  };

  const zoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom / ZOOM_STEP, MIN_ZOOM));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  return { zoom, zoomIn, zoomOut, resetZoom };
}
