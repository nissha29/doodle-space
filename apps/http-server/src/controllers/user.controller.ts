import { Request, Response } from "express"
import jwt from 'jsonwebtoken'
import { CreateUserSchema, signInSchema } from '@repo/common/types'

const signup = (req: Request, res: Response) => {
    const data = CreateUserSchema.safeParse(req.body);
    if(! data.success){
        return res.json({
            message: `Incorrect inputs`
        })
    }

    res.json({
        message: `User Signed up`
    })
}

const signin = (req: Request, res: Response) => {
    const data = signInSchema.safeParse(req.body);
    if(! data.success){
        return res.json({
            message: `Incorrect inputs`
        })
    }

    const userId = 'something';
    const secret = process.env?.JWT_SECRET || '';

    const token = jwt.sign({
        userId
    }, secret);

    res.json({
        message: token
    })
}

export {
    signup,
    signin
}