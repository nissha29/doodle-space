import { CanvasInitParams, Shape } from "@/types/types";

export default async function canvasInit({ canvas, roomId, shapesStore }: CanvasInitParams) {
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return;
    }

    clearCanvas(canvas, ctx, shapesStore.existingShapes);

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
        shapesStore.addShape(shape);
    })

    canvas.addEventListener('mousemove', (e) => {
        if (clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            clearCanvas(canvas, ctx, shapesStore.existingShapes);
            ctx.strokeStyle = '#ffffff'
            ctx.strokeRect(startX, startY, width, height);
        }
    })
}

function clearCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, existingShapes: Shape[]) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes.map((shape: Shape) => {
        if (shape.type === 'rect') {
            ctx.strokeStyle = '#ffffff'
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
    })
}