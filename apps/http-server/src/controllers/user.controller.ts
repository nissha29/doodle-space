import { Request, Response } from "express"
import jwt from 'jsonwebtoken'

const signup = (req: Request, res: Response) => {
    res.json({
        message: `User Signed up`
    })
}

const signin = (req: Request, res: Response) => {
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