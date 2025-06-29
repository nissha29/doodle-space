import { z } from 'zod'

export const CreateUserSchema = z.object({
    username: z.string().min(3).max(20),
    name: z.string().min(3).max(30),
    password: z.string(),
})

export const signInSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string(),
})

export const CreateRoomSchema = z.object({
    roomName: z.string().min(3).max(20),
})