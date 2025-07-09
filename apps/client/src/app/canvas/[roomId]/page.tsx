import Canvas from "@/components/canvas/canvas";
import ProtectedRoute from "@/components/guards/ProtectedRoute";

export default async function CanvasPage({ params }: { params: { roomId: string }}) {
  const param = await params;
  const roomId = Number(param.roomId);
  
  return (
    <ProtectedRoute>
      <Canvas roomId={roomId}/>
    </ProtectedRoute>
  );
}
