import { HTTP_URL } from '@/config';
import axios, { AxiosError } from 'axios';


export const signup = async (userData: { name: string, email: string, password: string }) => {
    try {
        const response = await axios.post(`${HTTP_URL}/user/signup`, userData);
        return response.data.result;
    } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        throw new Error(err.response?.data.error || 'Signup failed');
    }
}

export const signin = async (userData: { email: string, password: string }) => {
    try {
        const response = await axios.post(`${HTTP_URL}/user/signin`, userData);
        return response.data.result;
    } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        throw new Error(err.response?.data.error || 'Signin failed');
    }
}

export const verifyUser = async(token: string) => {
    try {
        const response = await axios.post(`${HTTP_URL}/user/me`, {}, {
            headers: {
                authorization: token,
            }
        });
        return response.data.result;
    } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        throw new Error(err.response?.data.error || 'Unauthenticated user');
    }
}