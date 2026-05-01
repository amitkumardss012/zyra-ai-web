import axios from "axios";
import { signOut } from "../../auth";

export const apiClient = axios.create({
    // baseURL: "https://zyra.mintafresh.com/api/v1",
    // baseURL: "http://168.231.123.247:7000/api/v1",
    baseURL: "http://localhost:4000/api/v1",
    // baseURL: "https://zyra.mintafresh.com/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Request interceptor to add token
apiClient.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
            }
            signOut({ redirectTo: "/auth" });
        }
        return Promise.reject(error);
    }
);