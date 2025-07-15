import Canvas from "@/components/canvas/Canvas";
import ProtectedRoute from "@/components/guards/ProtectedRoute";

export default function canvasPage() {
  return (
    <ProtectedRoute>
      <Canvas />
    </ProtectedRoute>
  );
}
