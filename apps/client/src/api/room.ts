import { HTTP_URL } from "@/config";
import axios, { AxiosError } from "axios";

export const createRoom = async (roomData: { linkId: string }) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('no token');
            return;
        }
        const response = await axios.post(`${HTTP_URL}/room/create`, roomData, {
            headers: {
                authorization: token,
            }
        });
        return response.data.result;
    } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        throw new Error(err.response?.data.error || 'Room creation failed');
    }
}

export const getExistingShapes = async (roomId: string) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('no token');
            return;
        }
        const response = await axios.get(`${HTTP_URL}/room/shapes/${roomId}`, {
            headers: {
                authorization: token,
            }
        });
        const data = response.data.result.shapes;

        const shapes = data.map((currShape: { shape: string }) => {
            const shape = currShape.shape;
            return shape;
        });
        console.log(shapes);
        return shapes;
    } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        throw new Error(err.response?.data.error || `Failed to fetch shapes ${error}`);
    }
}