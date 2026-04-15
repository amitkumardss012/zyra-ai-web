import axios from "axios";
import { signOut } from "../../auth";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            signOut({ redirectTo: "/auth" });
        }
        return Promise.reject(error);
    }
);