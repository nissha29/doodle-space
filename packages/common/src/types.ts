import { z } from 'zod'

export const CreateUserSchema = z.object({
    name: z.string().min(3, { message: 'Name must be atleast 3 characters' }).max(20, { message: 'Name must be between 3 and 20 characters' }),
    email: z.string().email({ message: 'Provide correct email format' }),
    password: z.string().min(5, { message: 'Password must be atleast 5 characters' }).max(20, { message: 'Password must be between 5 and 20 characters' }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/, { message: "Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character" })
})

export const signInSchema = z.object({
    email: z.string().email({ message: 'Provide correct email format' }),
    password: z.string().min(5, { message: 'Password must be atleast 5 characters' }).max(20, { message: 'Password must be between 5 and 20 characters' }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/, { message: "Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character" })
})

export const CreateRoomSchema = z.object({
    linkId: z.string(),
})

export type Dimension = {
    x: number,
    y: number
}

export type Shape = {
    id: string,
    type: 'rectangle',
    dimension: Dimension[],
    x: number,
    y: number,
    width: number,
    height: number,
    seed?: number
} | {
    id: string,
    type: 'circle',
    dimension: Dimension[],
    x: number,
    y: number,
    diameter: number,
    seed?: number
} | {
    id: string,
    type: 'diamond',
    dimension: Dimension[],
    diamondPoints: [number, number][],
    seed?: number
} | {
    id: string,
    type: 'arrow',
    dimension: Dimension[],
    shaft: {
        x1: number,
        y1: number,
        x2: number,
        y2: number
    },
    tip: number[],
    left: number[],
    right: number[],
    seed?: number
} | {
    id: string,
    type: 'line',
    dimension: Dimension[],
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    seed?: number
} | {
    id: string,
    type: 'text',
    x: number;
    y: number;
    text: string;
    font: string;
    color: string;
} | {
    id: string,
    type: 'pencil',
    points: Dimension[],
    options?: any
}