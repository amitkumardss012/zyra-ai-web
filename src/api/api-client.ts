import { ENV } from "@/lib/env";
import axios from "axios";
import { signOut } from "../../auth";

export const apiClient = axios.create({
    baseURL: ENV.API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            signOut({ redirectTo: "/auth" });
        }
        return Promise.reject(error);
    }
);