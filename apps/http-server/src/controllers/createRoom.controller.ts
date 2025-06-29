import { CreateRoomSchema } from "@repo/common/types";
import { Request, Response } from "express";

const createRoom = (req: Request, res: Response) => {
    const data = CreateRoomSchema.safeParse(req.body);
    if (!data.success) {
        return res.json({
            message: `Incorrect inputs`
        })
    }
    
    res.json({
        message: `Room Created`
    })
}

export {
    createRoom
}