import { z } from 'zod'

export const CreateUserSchema = z.object({
    name: z.string().min(3, { message: 'Name must be atleast 3 characters' }).max(20, { message: 'Name must be between 3 and 20 characters'}),
    email: z.string().email({ message: 'Provide correct email format' }),
    password: z.string().min(5, { message: 'Password must be atleast 5 characters' }).max(20, { message: 'Password must be between 5 and 20 characters' }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,{ message: "Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character" })
})

export const signInSchema = z.object({
    email: z.string().email({ message: 'Provide correct email format' }),
    password: z.string().min(5, { message: 'Password must be atleast 5 characters' }).max(20, { message: 'Password must be between 5 and 20 characters' }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,{ message: "Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character" })
})

export const CreateRoomSchema = z.object({
    slug: z.string().min(3, { message: 'Name must be atleast 3 characters' }).max(40, { message: 'Name must be between 3 and 40 characters'}),
})

export type Shape = {
  type: 'rect',
  x: number,
  y: number,
  width: number,
  height: number
} | {
  type: 'circle',
  radius: number,
  centreX: number,
  centreY: number
}