import { ENV } from "@/lib/env";
import axios from "axios";
import { signOut } from "../../auth";

export const apiClient = axios.create({
    // baseURL: "https://zyra.mintafresh.com/api/v1",
    baseURL: "http://168.231.123.247:7000/api/v1",
    // baseURL: "http://localhost:4000/api/v1",
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