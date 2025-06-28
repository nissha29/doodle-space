import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "../types/express";
import { JWT_SECRET } from '@repo/server-common/config'

export function auth(req: CustomRequest, res: Response, next: NextFunction){
    const token = req.headers['authorization'] || '';
    const secret = JWT_SECRET || '';

    const decoded = jwt.verify(token, secret);

    if(decoded){
        req.userId =  (decoded as JwtPayload).userId;
        next();
    }
    else{
        res.json({
            message: 'You are not authorized',
        })
    }
}