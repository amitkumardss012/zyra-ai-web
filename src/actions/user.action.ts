"use server"

import { apiClient } from "@/api/api-client";
import type { User } from "@/types/user.types";
import { cacheLife, cacheTag } from "next/cache";

export const getCurrentUser = async (token?: string): Promise<User | null> => {
    "use cache";
    cacheTag("current-user")
    cacheLife("minutes")
    try {
        const res = await apiClient.get("/user/profile", { headers: { Authorization: `Bearer ${token}` } });
        return res.data.data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}