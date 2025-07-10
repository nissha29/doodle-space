import { HTTP_URL } from "@/config";
import axios, { AxiosError } from "axios";

export const getExistingShapes = async (roomId: number) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('no token');
            return ;
        }
        const response = await axios.get(`${HTTP_URL}/room/shapes/${roomId}`, {
            headers: {
                authorization: token,
            }
        });
        console.log(response);
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