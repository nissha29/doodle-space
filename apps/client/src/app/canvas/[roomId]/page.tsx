"use client";

import Canvas from "@/components/canvas/canvas";
import ProtectedRoute from "@/components/guards/ProtectedRoute";

export default function CanvasPage() {
  return (
    <ProtectedRoute>
      <Canvas />
    </ProtectedRoute>
  );
}
