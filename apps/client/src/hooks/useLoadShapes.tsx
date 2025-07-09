import { getExistingShapes } from "@/api/room";
import { useShapesStore } from "@/store/useShapesStore";
import { useEffect, useState } from "react";

export default function useLoadShapes(roomId: number) {
  const [isRoom, setIsRoom] = useState<boolean | null>(null);
  const setShapes = useShapesStore((s) => s.setShapes);

  useEffect(() => {
      const fetchExistingShapes = async () => {
        try {
          const existingShapes = await getExistingShapes(roomId);
          setShapes(existingShapes);
          setIsRoom(true);
        } catch (error) {
          console.log(error);
          setIsRoom(false);
        }
      };
      fetchExistingShapes();
  }, [roomId, setShapes]);

  return { isRoom };
}
