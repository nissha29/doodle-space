import { Request, Response } from "express";

const createRoom = (req: Request, res: Response) => {
    res.json({
        message: `Room Created`
    })
}

export {
    createRoom
}