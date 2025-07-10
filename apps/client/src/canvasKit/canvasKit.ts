import { CanvasInitParams, Shape } from "@/types/types";
import { clearCanvas } from "./clearCanvas";
import { receiveMessage, sendMessage } from "@/socket-handlers/init";

export default async function canvasInit({ canvas, roomId, shapesStore, socket }: CanvasInitParams) {
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return;
    }

    receiveMessage(roomId, canvas, ctx, shapesStore, socket)
    clearCanvas(canvas, ctx, shapesStore);

    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener('mousedown', (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    })

    canvas.addEventListener('mouseup', (e) => {
        clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        const shape: Shape = { type: 'rect', x: startX, y: startY, width, height }
        shapesStore.getState().addShape(shape);
        sendMessage(roomId, shape, socket);
    })

    canvas.addEventListener('mousemove', (e) => {
        if (clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            clearCanvas(canvas, ctx, shapesStore);
            ctx.strokeStyle = '#ffffff'
            ctx.strokeRect(startX, startY, width, height);
        }
    })
}
