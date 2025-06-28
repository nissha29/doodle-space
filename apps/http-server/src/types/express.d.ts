import { Request } from "express";

export interface CustomRequest extends Request {
    userId ?: string,
}