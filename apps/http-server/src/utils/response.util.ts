import { Response } from "express";

interface ISuccess {
    res: Response,
    data: any,
    message: string,
    statusCode?: number,
}

interface IError {
    res: Response,
    error: string,
    statusCode?: number,
}

export function emitSuccess({ res, data, message, statusCode = 200 }: ISuccess) {
    res.status(statusCode).json({ data, message })
}

export function emitError({ res, error, statusCode = 500 }: IError) {
    res.status(statusCode).json({ error })
}