import { clearCanvas } from "@/canvasKit/clearCanvas";
import { ShapeStore } from "@/types/types";
import { Shape } from "@repo/common/types";
import { StoreApi, UseBoundStore } from "zustand";

export const receiveMessage = (roomId: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, shapeStore: UseBoundStore<StoreApi<ShapeStore>>,  socket: WebSocket | null) => {
    if (!socket) {
        console.log('No socket connection is there')
        return;
    }

    socket.onmessage = (event) => {
        const parsedMessage = JSON.parse(event.data);
        console.log(parsedMessage);
        if (parsedMessage.type === 'chat') {
            shapeStore.getState().addShape(parsedMessage.shape);
            clearCanvas(canvas, ctx, shapeStore);
        }
    }
}

export const sendMessage = (roomId: number, shape: Shape, socket: WebSocket | null) => {

    if (!socket) {
        console.log('No socket connection is there')
        return;
    }

    socket.send(JSON.stringify({
        type: 'chat',
        shape, 
        roomId,
    }))
}