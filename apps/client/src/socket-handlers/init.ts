import { clearCanvas } from "@/canvasKit/clearCanvas";
import useSocket from "@/hooks/useSocket"
import { Shape, ShapeStore } from "@/types/types";
import { StoreApi, UseBoundStore } from "zustand";

export const receiveMessage = (roomId: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, shapeStore: UseBoundStore<StoreApi<ShapeStore>>,  socket: WebSocket | null) => {

    if (!socket) {
        console.log('No socket connection is there')
        return;
    }

    socket.onmessage = (event) => {
        const parsedMessage = JSON.parse(event.data);
        if (parsedMessage.type === 'chat') {
            const parsedShape = JSON.parse(parsedMessage.shape);
            shapeStore.getState().addShape(parsedShape);
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