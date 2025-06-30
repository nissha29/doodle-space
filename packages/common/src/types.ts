import { z } from 'zod'

export const CreateUserSchema = z.object({
    name: z.string().min(3, { message: 'Name must be atleast 3 characters' }).max(20, { message: 'Name must be between 3 and 20 characters'}),
    email: z.string().email({ message: 'Provide correct email format' }),
    password: z.string().min(5, { message: 'Password must be atleast 5 characters' }).max(20, { message: 'Password must be between 5 and 20 characters' }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,{ message: "Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character" })
})

export const signInSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string(),
})

export const CreateRoomSchema = z.object({
    roomName: z.string().min(3).max(20),
})