import { Shape, ShapeStore } from "@/types/types";
import { StoreApi, UseBoundStore } from "zustand";

export function clearCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, shapeStore: UseBoundStore<StoreApi<ShapeStore>>) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    shapeStore.getState().existingShapes.map((shape: Shape) => {
        if (shape.type === 'rect') {
            ctx.strokeStyle = '#ffffff'
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
    })
}